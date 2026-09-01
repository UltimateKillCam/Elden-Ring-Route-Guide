using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Web.WebView2.WinForms;

internal sealed class HostWindow : Form
{
    private readonly WebView2 browser = new WebView2 { Dock = DockStyle.Fill };
    private readonly Label status = new Label {
        Dock = DockStyle.Fill, TextAlign = ContentAlignment.MiddleCenter,
        ForeColor = Color.FromArgb(220, 193, 136), BackColor = Color.FromArgb(13, 15, 13),
        Font = new Font("Segoe UI", 12), Text = "Starting the route guide…"
    };
    private Process server;
    private readonly string root;

    internal HostWindow()
    {
        Text = "Tarnished Together";
        Width = 1500; Height = 950; MinimumSize = new Size(900, 650);
        BackColor = status.BackColor;
        root = FindProjectRoot(AppDomain.CurrentDomain.BaseDirectory);
        Controls.Add(status);
        Shown += async (_, __) => await StartGuide();
        FormClosing += (_, __) => StopGuide();
    }

    private static string FindProjectRoot(string start)
    {
        var directory = new DirectoryInfo(start);
        while (directory != null) {
            if (File.Exists(Path.Combine(directory.FullName, "scripts", "lan-server.mjs"))) return directory.FullName;
            directory = directory.Parent;
        }
        throw new DirectoryNotFoundException("Place Tarnished Together.exe inside the Elden Ring Route Guide folder.");
    }

    private async Task StartGuide()
    {
        try {
            var start = new ProcessStartInfo("node", "scripts/lan-server.mjs") {
                WorkingDirectory = root, UseShellExecute = false, CreateNoWindow = true,
                RedirectStandardOutput = true, RedirectStandardError = true
            };
            start.EnvironmentVariables["ELDEN_RING_NO_BROWSER"] = "1";
            server = new Process { StartInfo = start, EnableRaisingEvents = true };
            var controller = new TaskCompletionSource<string>();
            DataReceivedEventHandler read = (_, eventArgs) => {
                if (String.IsNullOrWhiteSpace(eventArgs.Data)) return;
                var match = Regex.Match(eventArgs.Data, @"http://localhost:\d+/\?control=[a-f0-9]+");
                if (match.Success) controller.TrySetResult(match.Value);
            };
            server.OutputDataReceived += read;
            server.ErrorDataReceived += (_, eventArgs) => { if (!String.IsNullOrWhiteSpace(eventArgs.Data)) Debug.WriteLine(eventArgs.Data); };
            if (!server.Start()) throw new InvalidOperationException("Node.js could not be started.");
            server.BeginOutputReadLine(); server.BeginErrorReadLine();
            var finished = await Task.WhenAny(controller.Task, Task.Delay(TimeSpan.FromSeconds(90)));
            if (finished != controller.Task) throw new TimeoutException("The local guide did not finish starting.");
            await browser.EnsureCoreWebView2Async();
            browser.CoreWebView2.Settings.IsStatusBarEnabled = false;
            browser.Source = new Uri(await controller.Task);
            Controls.Clear(); Controls.Add(browser);
        }
        catch (Exception error)
        {
            status.Text = "Tarnished Together could not start.\n\n" + error.Message + "\n\nMake sure Node.js is installed, then try again.";
        }
    }

    private void StopGuide()
    {
        try {
            if (server == null || server.HasExited) return;
            using (var cleanup = Process.Start(new ProcessStartInfo("taskkill", "/pid " + server.Id + " /t /f") {
                UseShellExecute = false, CreateNoWindow = true, WindowStyle = ProcessWindowStyle.Hidden
            })) cleanup.WaitForExit(5000);
        } catch { try { if (server != null && !server.HasExited) server.Kill(); } catch { } }
    }
}

internal static class Program
{
    [STAThread]
    private static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new HostWindow());
    }
}
