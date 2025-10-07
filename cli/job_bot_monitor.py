#!/usr/bin/env python3
"""
Job Application Bot - Monitor Extension for CLI
Real-time job monitoring commands
"""

import requests
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich import print as rprint

console = Console()

class MonitorCLI:
    def __init__(self, api_url="http://localhost:5000"):
        self.api_url = api_url
    
    def add_watch(self, keywords, location, platforms=None, auto_apply=True, 
                  email=None, resume=None, remote=False, min_salary=None):
        """Add a new watch criteria"""
        data = {
            "keywords": keywords,
            "location": location,
            "platforms": platforms or ["linkedin", "indeed"],
            "autoApply": auto_apply,
            "remote": remote
        }
        
        if email:
            data["userEmail"] = email
        if resume:
            data["resumePath"] = resume
        if min_salary:
            data["minSalary"] = min_salary
        
        try:
            response = requests.post(
                f"{self.api_url}/api/monitor/watch",
                json=data,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                watch = result.get("watchItem", {})
                
                console.print("\n[green]✓[/green] Watch criteria added successfully!\n")
                
                panel = Panel(
                    f"""
[bold cyan]Keywords:[/bold cyan] {watch.get('keywords')}
[bold cyan]Location:[/bold cyan] {watch.get('location')}
[bold cyan]Platforms:[/bold cyan] {', '.join(watch.get('platforms', []))}
[bold cyan]Auto-Apply:[/bold cyan] {'✅ Yes' if watch.get('autoApply') else '❌ No'}
[bold cyan]Watch ID:[/bold cyan] {watch.get('id')}
                    """,
                    title="🔍 New Watch Created",
                    border_style="green"
                )
                console.print(panel)
                
                console.print("\n[dim]Use 'monitor start' to begin monitoring[/dim]\n")
            else:
                console.print(f"[red]Error: {response.status_code}[/red]")
        except Exception as e:
            console.print(f"[red]Error: {str(e)}[/red]")
    
    def list_watches(self):
        """List all watch criteria"""
        try:
            response = requests.get(
                f"{self.api_url}/api/monitor/watch",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                watches = data.get("watchList", [])
                
                if not watches:
                    console.print("\n[yellow]No watch criteria configured[/yellow]")
                    console.print("[dim]Use 'monitor add' to create one[/dim]\n")
                    return
                
                console.print(f"\n[bold]Active Watch Criteria ({len(watches)})[/bold]\n")
                
                table = Table(show_header=True, header_style="bold magenta")
                table.add_column("ID", style="dim", width=15)
                table.add_column("Keywords", style="cyan")
                table.add_column("Location", style="green")
                table.add_column("Platforms", style="blue")
                table.add_column("Auto-Apply", style="yellow")
                table.add_column("Status")
                
                for watch in watches:
                    status = "🟢 Active" if watch.get("enabled") else "⏸️ Paused"
                    auto_apply = "✅" if watch.get("autoApply") else "❌"
                    platforms = ", ".join(watch.get("platforms", []))
                    
                    table.add_row(
                        str(watch.get("id", ""))[:12],
                        watch.get("keywords", ""),
                        watch.get("location", ""),
                        platforms,
                        auto_apply,
                        status
                    )
                
                console.print(table)
                console.print()
            else:
                console.print(f"[red]Error: {response.status_code}[/red]")
        except Exception as e:
            console.print(f"[red]Error: {str(e)}[/red]")
    
    def remove_watch(self, watch_id):
        """Remove a watch criteria"""
        try:
            response = requests.delete(
                f"{self.api_url}/api/monitor/watch/{watch_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                console.print(f"\n[green]✓[/green] Watch {watch_id} removed successfully\n")
            else:
                console.print(f"[red]Error: {response.status_code}[/red]")
        except Exception as e:
            console.print(f"[red]Error: {str(e)}[/red]")
    
    def start_monitor(self):
        """Start the job monitor"""
        try:
            response = requests.post(
                f"{self.api_url}/api/monitor/start",
                timeout=10
            )
            
            if response.status_code == 200:
                console.print("\n[green]✓[/green] Job monitor started successfully!\n")
                
                panel = Panel(
                    """
[bold green]Monitor is now running in the background[/bold green]

The bot will check for new jobs every 2 minutes and
automatically apply to matching positions.

You'll receive email notifications when:
• New jobs are found
• Applications are submitted
• Daily summaries

[dim]Use 'monitor status' to check progress[/dim]
                    """,
                    title="🚀 Monitor Active",
                    border_style="green"
                )
                console.print(panel)
            else:
                console.print(f"[red]Error: {response.status_code}[/red]")
        except Exception as e:
            console.print(f"[red]Error: {str(e)}[/red]")
    
    def stop_monitor(self):
        """Stop the job monitor"""
        try:
            response = requests.post(
                f"{self.api_url}/api/monitor/stop",
                timeout=10
            )
            
            if response.status_code == 200:
                console.print("\n[yellow]⏸️[/yellow] Job monitor stopped\n")
            else:
                console.print(f"[red]Error: {response.status_code}[/red]")
        except Exception as e:
            console.print(f"[red]Error: {str(e)}[/red]")
    
    def show_status(self):
        """Show monitor status"""
        try:
            response = requests.get(
                f"{self.api_url}/api/monitor/status",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                status = data.get("status", {})
                
                is_running = status.get("isMonitoring", False)
                status_emoji = "🟢" if is_running else "⏸️"
                status_text = "Running" if is_running else "Stopped"
                
                panel = Panel(
                    f"""
[bold cyan]Status:[/bold cyan] {status_emoji} {status_text}
[bold cyan]Active Watches:[/bold cyan] {status.get('watchListCount', 0)}
[bold cyan]Jobs Tracked:[/bold cyan] {status.get('seenJobsCount', 0)}
[bold cyan]Check Interval:[/bold cyan] Every {status.get('checkIntervalMinutes', 0)} minutes
[bold cyan]Today's Applications:[/bold cyan] {status.get('dailyApplicationCount', 0)} / {status.get('dailyLimit', 0)}
                    """,
                    title="📊 Monitor Status",
                    border_style="cyan"
                )
                console.print(panel)
            else:
                console.print(f"[red]Error: {response.status_code}[/red]")
        except Exception as e:
            console.print(f"[red]Error: {str(e)}[/red]")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Job Monitor - Real-time job watching and auto-apply",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s add -k "Python Developer" -l "Remote" --auto-apply
  %(prog)s add -k "DevOps Engineer" -l "San Francisco" --email me@email.com
  %(prog)s list
  %(prog)s start
  %(prog)s status
  %(prog)s stop
  %(prog)s remove 1696789012345.678
        """
    )
    
    parser.add_argument('command', 
                       choices=['add', 'list', 'remove', 'start', 'stop', 'status'],
                       help='Monitor command to execute')
    parser.add_argument('-k', '--keywords', 
                       help='Job search keywords')
    parser.add_argument('-l', '--location', 
                       help='Job location')
    parser.add_argument('--platforms', 
                       nargs='+',
                       choices=['linkedin', 'indeed', 'glassdoor', 'upwork'],
                       help='Platforms to search')
    parser.add_argument('--auto-apply', 
                       action='store_true',
                       help='Enable automatic application')
    parser.add_argument('--email', 
                       help='Email for notifications')
    parser.add_argument('--resume', 
                       help='Path to resume file')
    parser.add_argument('--remote', 
                       action='store_true',
                       help='Only remote jobs')
    parser.add_argument('--min-salary', 
                       type=int,
                       help='Minimum salary requirement')
    parser.add_argument('--watch-id', 
                       help='Watch ID to remove')
    
    args = parser.parse_args()
    
    monitor = MonitorCLI()
    
    console.print("\n[bold cyan]🤖 Job Application Bot - Monitor[/bold cyan]\n")
    
    if args.command == 'add':
        if not args.keywords or not args.location:
            console.print("[red]Error: --keywords and --location are required[/red]")
            return
        monitor.add_watch(
            args.keywords,
            args.location,
            args.platforms,
            args.auto_apply,
            args.email,
            args.resume,
            args.remote,
            args.min_salary
        )
    elif args.command == 'list':
        monitor.list_watches()
    elif args.command == 'remove':
        if not args.watch_id:
            console.print("[red]Error: --watch-id is required[/red]")
            return
        monitor.remove_watch(args.watch_id)
    elif args.command == 'start':
        monitor.start_monitor()
    elif args.command == 'stop':
        monitor.stop_monitor()
    elif args.command == 'status':
        monitor.show_status()

if __name__ == "__main__":
    main()
