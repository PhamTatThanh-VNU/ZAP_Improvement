import os
import time
from zapv2 import ZAPv2
from urllib.parse import urlparse
class ZapRunner:
    def __init__(self, apikey, address, port, logger):
        self.zap = ZAPv2(
            apikey=apikey,
            proxies={
                'http': f'http://{address}:{port}',
                'https': f'http://{address}:{port}'
            }
        )
        self.logger = logger

    def disable_all_active_scanners(self):
        try:
            self.zap.ascan.disable_all_scanners()
        except Exception as e:
            self.logger.error(f"Failed to disable all scanners: {e}")

    def load_active_script(self, script_file, script_name="script_load_by_tool_cli", script_description="Loaded by CLI"):
        """Load and enable ZAP active script"""
        try:
            script_path = os.path.abspath(os.path.join("zap_scripts_by_llm", os.path.basename(script_file)))
            
            try:
                self.zap.script.remove(script_name)
            except:
                pass
                
            self.zap.script.load(
                scriptname=script_name,
                scripttype='active',
                scriptengine='Graal.js',
                filename=script_path,
                scriptdescription=script_description
            )
            self.zap.script.enable(script_name)
            self.logger.info(f"Loaded script: {script_name}")
        except Exception as e:
            self.logger.error(f"Failed to load script: {e}")
            raise

    def log_script_errors(self):
        """Log script errors and return list of errors"""
        errors = []
        try:
            scripts = self.zap.script.list_scripts
            for s in scripts:
                if s.get('engine') == 'Graal.js' and s.get('lastError'):
                    error_msg = f"Script: {s.get('name')}, Error: {s.get('lastError')}"
                    self.logger.error(error_msg)
                    errors.append(s.get('lastError'))
        except Exception as e:
            error_msg = f"Failed to get script errors: {e}"
            self.logger.error(error_msg)
            errors.append(error_msg)
        return errors

    def run_active_scan(self, url):
        """Run active scan and return any script errors"""
        self.logger.info(f"Start scan pipeline on: {url}")
        try:
            parsed = urlparse(url)
            base_url = f"{parsed.scheme}://{parsed.netloc}/"            
            self.zap.core.access_url(url, followredirects=True)

            # Run traditional spider
            spider_scan_id = self.zap.spider.scan(url)
            self.logger.info(f"Spider started (scan ID: {spider_scan_id})")
            self._wait_for_spider(spider_scan_id)
            spider_results = [u for u in (self.zap.spider.results(spider_scan_id) or []) if u]
            self.logger.info(f"Spider discovered {len(spider_results)} URLs")
            
            # Single recursive active scan - ZAP will scan all discovered URLs
            scan_id = self.zap.ascan.scan(base_url, recurse=True)
            self.logger.info(f"Recursive active scan started (scan ID: {scan_id})")
            self._wait_for_ascan(scan_id)

            return self.log_script_errors()
        except Exception as e:
            self.logger.error(f"Error running scan pipeline: {e}")
            return [str(e)]

    def _wait_for_spider(self, scan_id, poll_interval=2):
        try:
            while True:
                status = int(self.zap.spider.status(scan_id))
                if status >= 100:
                    break
                self.logger.info(f"Spider progress: {status}%")
                time.sleep(poll_interval)
        except Exception as e:
            self.logger.warning(f"Spider status check failed: {e}")

    def _wait_for_ascan(self, scan_id, poll_interval=2):
        try:
            while True:
                status = int(self.zap.ascan.status(scan_id))
                if status >= 100:
                    break
                self.logger.info(f"Active scan {scan_id} progress: {status}%")
                time.sleep(poll_interval)
        except Exception as e:
            self.logger.warning(f"Active scan status check failed: {e}")
      
