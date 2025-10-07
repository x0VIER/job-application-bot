#!/usr/bin/env python3
"""
Job Application Bot - Python CLI Version
A command-line interface for automated job applications
"""

import os
import sys
import json
import time
import argparse
from datetime import datetime
from pathlib import Path

try:
    import requests
    from rich.console import Console
    from rich.table import Table
    from rich.progress import Progress, SpinnerColumn, TextColumn
    from rich.panel import Panel
    from rich import print as rprint
except ImportError:
    print("Installing required packages...")
    os.system(f"{sys.executable} -m pip install requests rich")
    import requests
    from rich.console import Console
    from rich.table import Table
    from rich.progress import Progress, SpinnerColumn, TextColumn
    from rich.panel import Panel
    from rich import print as rprint

console = Console()

class JobBot:
    def __init__(self, api_url="http://localhost:5000"):
        self.api_url = api_url
        self.config_file = Path.home() / ".job-bot-config.json"
        self.config = self.load_config()
    
    def load_config(self):
        """Load configuration from file"""
        if self.config_file.exists():
            with open(self.config_file, 'r') as f:
                return json.load(f)
        return {
            "keywords": "Software Engineer",
            "location": "Remote",
            "platforms": ["linkedin", "indeed"],
            "resume_path": "",
            "daily_limit": 50
        }
    
    def save_config(self):
        """Save configuration to file"""
        with open(self.config_file, 'w') as f:
            json.dump(self.config, f, indent=2)
        console.print(f"[green]✓[/green] Configuration saved to {self.config_file}")
    
    def show_banner(self):
        """Display welcome banner"""
        banner = """
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        🤖  JOB APPLICATION BOT - CLI VERSION  🤖         ║
║                                                           ║
║     Automate Your Job Search Across Multiple Platforms   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
        """
        console.print(banner, style="bold cyan")
    
    def search_jobs(self, keywords=None, location=None):
        """Search for jobs"""
        keywords = keywords or self.config["keywords"]
        location = location or self.config["location"]
        
        console.print(f"\n[bold]Searching for jobs...[/bold]")
        console.print(f"Keywords: [cyan]{keywords}[/cyan]")
        console.print(f"Location: [cyan]{location}[/cyan]\n")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            task = progress.add_task("Scraping job boards...", total=None)
            
            try:
                response = requests.post(
                    f"{self.api_url}/api/jobs/search",
                    json={
                        "keywords": keywords,
                        "location": location,
                        "platforms": self.config["platforms"]
                    },
                    timeout=60
                )
                
                if response.status_code == 200:
                    data = response.json()
                    jobs = data.get("jobs", [])
                    
                    progress.stop()
                    
                    if not jobs:
                        console.print("[yellow]No jobs found matching your criteria[/yellow]")
                        return []
                    
                    console.print(f"\n[green]✓[/green] Found [bold]{len(jobs)}[/bold] jobs!\n")
                    
                    # Display jobs in a table
                    table = Table(show_header=True, header_style="bold magenta")
                    table.add_column("#", style="dim", width=4)
                    table.add_column("Title", style="cyan")
                    table.add_column("Company", style="green")
                    table.add_column("Location", style="yellow")
                    table.add_column("Platform", style="blue")
                    
                    for idx, job in enumerate(jobs, 1):
                        table.add_row(
                            str(idx),
                            job.get("title", "N/A"),
                            job.get("company", "N/A"),
                            job.get("location", "N/A"),
                            job.get("platform", "N/A")
                        )
                    
                    console.print(table)
                    
                    # Save jobs to file
                    jobs_file = Path.home() / ".job-bot-jobs.json"
                    with open(jobs_file, 'w') as f:
                        json.dump(jobs, f, indent=2)
                    
                    console.print(f"\n[dim]Jobs saved to {jobs_file}[/dim]")
                    return jobs
                else:
                    progress.stop()
                    console.print(f"[red]Error: {response.status_code}[/red]")
                    return []
            except requests.exceptions.ConnectionError:
                progress.stop()
                console.print("[red]✗[/red] Cannot connect to backend server!")
                console.print("[yellow]Make sure the backend is running:[/yellow]")
                console.print("  cd backend && npm start")
                return []
            except Exception as e:
                progress.stop()
                console.print(f"[red]Error: {str(e)}[/red]")
                return []
    
    def apply_to_jobs(self, job_indices=None):
        """Apply to jobs"""
        jobs_file = Path.home() / ".job-bot-jobs.json"
        
        if not jobs_file.exists():
            console.print("[red]No jobs found. Run 'search' first![/red]")
            return
        
        with open(jobs_file, 'r') as f:
            all_jobs = json.load(f)
        
        if not all_jobs:
            console.print("[yellow]No jobs available to apply to[/yellow]")
            return
        
        # Select jobs to apply to
        if job_indices:
            jobs_to_apply = [all_jobs[i-1] for i in job_indices if 0 < i <= len(all_jobs)]
        else:
            jobs_to_apply = all_jobs
        
        console.print(f"\n[bold]Applying to {len(jobs_to_apply)} job(s)...[/bold]\n")
        
        try:
            response = requests.post(
                f"{self.api_url}/api/jobs/apply",
                json={
                    "jobs": jobs_to_apply,
                    "resumePath": self.config.get("resume_path", ""),
                    "coverLetter": ""
                },
                timeout=120
            )
            
            if response.status_code == 200:
                data = response.json()
                results = data.get("results", [])
                
                # Display results
                table = Table(show_header=True, header_style="bold magenta")
                table.add_column("Job", style="cyan")
                table.add_column("Company", style="green")
                table.add_column("Status", style="yellow")
                table.add_column("Message")
                
                for result in results:
                    status_color = "green" if result["status"] == "success" else "red"
                    table.add_row(
                        result["job"],
                        result["company"],
                        f"[{status_color}]{result['status']}[/{status_color}]",
                        result["message"]
                    )
                
                console.print(table)
                console.print(f"\n[green]✓[/green] Application process completed!")
            else:
                console.print(f"[red]Error: {response.status_code}[/red]")
        except Exception as e:
            console.print(f"[red]Error: {str(e)}[/red]")
    
    def show_stats(self):
        """Show application statistics"""
        try:
            response = requests.get(f"{self.api_url}/api/stats", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                stats = data.get("stats", {})
                
                panel = Panel(
                    f"""
[bold cyan]Total Applications:[/bold cyan] {stats.get('total', 0)}
[bold green]Successful:[/bold green] {stats.get('successful', 0)}
[bold yellow]Pending:[/bold yellow] {stats.get('pending', 0)}
[bold red]Failed:[/bold red] {stats.get('failed', 0)}
                    """,
                    title="📊 Application Statistics",
                    border_style="cyan"
                )
                console.print(panel)
            else:
                console.print(f"[red]Error fetching stats: {response.status_code}[/red]")
        except Exception as e:
            console.print(f"[red]Error: {str(e)}[/red]")
    
    def configure(self):
        """Interactive configuration"""
        console.print("\n[bold]Configuration Setup[/bold]\n")
        
        keywords = console.input(f"Job keywords [{self.config['keywords']}]: ").strip()
        if keywords:
            self.config['keywords'] = keywords
        
        location = console.input(f"Location [{self.config['location']}]: ").strip()
        if location:
            self.config['location'] = location
        
        resume = console.input(f"Resume path [{self.config.get('resume_path', 'None')}]: ").strip()
        if resume:
            self.config['resume_path'] = resume
        
        limit = console.input(f"Daily limit [{self.config['daily_limit']}]: ").strip()
        if limit and limit.isdigit():
            self.config['daily_limit'] = int(limit)
        
        self.save_config()
    
    def show_config(self):
        """Display current configuration"""
        panel = Panel(
            f"""
[bold cyan]Keywords:[/bold cyan] {self.config['keywords']}
[bold cyan]Location:[/bold cyan] {self.config['location']}
[bold cyan]Platforms:[/bold cyan] {', '.join(self.config['platforms'])}
[bold cyan]Resume Path:[/bold cyan] {self.config.get('resume_path', 'Not set')}
[bold cyan]Daily Limit:[/bold cyan] {self.config['daily_limit']}
            """,
            title="⚙️  Current Configuration",
            border_style="cyan"
        )
        console.print(panel)

def main():
    parser = argparse.ArgumentParser(
        description="Job Application Bot - Automate your job search",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s search                          # Search for jobs
  %(prog)s search -k "Python Developer"    # Search with custom keywords
  %(prog)s apply                           # Apply to all found jobs
  %(prog)s apply -i 1 2 3                  # Apply to specific jobs
  %(prog)s stats                           # Show statistics
  %(prog)s config                          # Configure settings
        """
    )
    
    parser.add_argument('command', 
                       choices=['search', 'apply', 'stats', 'config', 'show-config'],
                       help='Command to execute')
    parser.add_argument('-k', '--keywords', 
                       help='Job search keywords')
    parser.add_argument('-l', '--location', 
                       help='Job location')
    parser.add_argument('-i', '--indices', 
                       nargs='+', 
                       type=int,
                       help='Job indices to apply to')
    
    args = parser.parse_args()
    
    bot = JobBot()
    bot.show_banner()
    
    if args.command == 'search':
        bot.search_jobs(args.keywords, args.location)
    elif args.command == 'apply':
        bot.apply_to_jobs(args.indices)
    elif args.command == 'stats':
        bot.show_stats()
    elif args.command == 'config':
        bot.configure()
    elif args.command == 'show-config':
        bot.show_config()

if __name__ == "__main__":
    main()
