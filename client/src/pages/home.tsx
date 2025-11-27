import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Lock, 
  Eye, 
  GitBranch, 
  Terminal, 
  CheckCircle, 
  AlertTriangle,
  Package,
  Bot,
  FileSearch,
  Globe,
  Copy,
  Check
} from "lucide-react";
import { useState } from "react";

const tools = [
  {
    id: "gitleaks",
    name: "Gitleaks",
    description: "Automated secret detection preventing credential leaks before they reach your repository.",
    icon: Lock,
    features: [
      "Pre-commit hooks",
      "CI/CD integration",
      "Custom patterns",
      "Historical scanning"
    ],
    status: "active"
  },
  {
    id: "semgrep",
    name: "Semgrep",
    description: "Static analysis security testing with OWASP Top 10 rules and custom patterns.",
    icon: FileSearch,
    features: [
      "SAST scanning",
      "Custom rule sets",
      "AI code detection",
      "Web vulnerabilities"
    ],
    status: "active"
  },
  {
    id: "socket",
    name: "Socket.dev",
    description: "Supply chain security monitoring for npm, PyPI, and other package ecosystems.",
    icon: Package,
    features: [
      "Dependency analysis",
      "Malware detection",
      "Risk scoring",
      "PR blocking"
    ],
    status: "active"
  },
  {
    id: "dependabot",
    name: "Dependabot",
    description: "Automated dependency updates across multiple ecosystems with weekly schedules.",
    icon: Bot,
    features: [
      "Multi-ecosystem",
      "Auto PR creation",
      "Security patches",
      "Version updates"
    ],
    status: "active"
  }
];

const setupSteps = [
  {
    title: "Installation",
    icon: Terminal,
    steps: [
      "pip install pre-commit",
      "pre-commit install"
    ],
    description: "Install local hooks for secret detection"
  },
  {
    title: "GitHub Setup",
    icon: GitBranch,
    steps: [
      "Install Socket.dev App",
      "Enable Dependabot alerts",
      "Push to trigger CI"
    ],
    description: "Enable GitHub-based security features"
  },
  {
    title: "Verification",
    icon: CheckCircle,
    steps: [
      "Create test PR",
      "Check workflow runs",
      "Review scan results"
    ],
    description: "Validate security scans are active"
  }
];

const securityRules = [
  { category: "Credentials", count: 8, severity: "critical" },
  { category: "AI Patterns", count: 6, severity: "warning" },
  { category: "Web Security", count: 12, severity: "critical" },
  { category: "Dependencies", count: 5, severity: "info" }
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button 
      size="icon" 
      variant="ghost" 
      className="h-6 w-6"
      onClick={handleCopy}
      data-testid={`button-copy-${text.slice(0, 10)}`}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative bg-card border border-border rounded-md p-4 font-mono text-sm">
      <div className="absolute top-2 right-2">
        <CopyButton text={code} />
      </div>
      <code className="text-muted-foreground">{code}</code>
    </div>
  );
}

function ToolCard({ tool }: { tool: typeof tools[0] }) {
  const Icon = tool.icon;
  return (
    <Card 
      className="hover-elevate border border-border" 
      data-testid={`card-tool-${tool.id}`}
    >
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-xl">{tool.name}</CardTitle>
            <Badge variant="outline" className="text-xs" data-testid={`badge-status-${tool.id}`}>
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{tool.description}</CardDescription>
        <ul className="space-y-2">
          {tool.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-chart-4" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SetupCard({ step }: { step: typeof setupSteps[0] }) {
  const Icon = step.icon;
  return (
    <Card className="border border-border" data-testid={`card-setup-${step.title.toLowerCase().replace(' ', '-')}`}>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
        <div className="p-2 rounded-lg bg-accent">
          <Icon className="h-5 w-5 text-accent-foreground" />
        </div>
        <CardTitle className="text-lg">{step.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
        <ol className="space-y-2">
          {step.steps.map((s, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-muted text-xs font-medium">
                {i + 1}
              </span>
              <span className="font-mono text-muted-foreground">{s}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-chart-1/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-6" data-testid="badge-hero">
                <Shield className="h-3 w-3 mr-1" />
                Production-Ready Security
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6" data-testid="text-hero-title">
                DevSecOps
                <span className="block text-primary">Automation</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="text-hero-description">
                Pre-configured security infrastructure with secret detection, SAST scanning, 
                supply chain security, and automated dependency updates. Zero configuration required.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-get-started">
                  <Terminal className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
                <Button size="lg" variant="outline" data-testid="button-view-docs">
                  <Eye className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <Card className="border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <div className="h-3 w-3 rounded-full bg-chart-3" />
                  <div className="h-3 w-3 rounded-full bg-chart-4" />
                  <span className="ml-2 text-sm text-muted-foreground font-mono">security-scan.yml</span>
                </div>
                <div className="font-mono text-sm space-y-1 text-muted-foreground">
                  <p><span className="text-chart-1">name:</span> Security Pipeline</p>
                  <p><span className="text-chart-1">on:</span> [push, pull_request]</p>
                  <p><span className="text-chart-1">jobs:</span></p>
                  <p className="pl-4"><span className="text-chart-4">gitleaks:</span> Secret Detection</p>
                  <p className="pl-4"><span className="text-chart-4">semgrep:</span> SAST Scanning</p>
                  <p className="pl-4"><span className="text-chart-4">socket:</span> Supply Chain</p>
                  <p className="pl-4"><span className="text-chart-4">dependabot:</span> Dependencies</p>
                </div>
              </Card>
              <div className="absolute -bottom-4 -right-4 p-3 rounded-lg bg-chart-4/20 border border-chart-4/30">
                <CheckCircle className="h-6 w-6 text-chart-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/50" data-testid="section-tools">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="text-tools-title">Security Tools</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Four integrated security layers working together to protect your codebase from secrets, vulnerabilities, and supply chain attacks.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-rules">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="text-rules-title">Custom Security Rules</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              31 custom Semgrep rules covering hardcoded credentials, AI-generated code patterns, and web security vulnerabilities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityRules.map((rule, i) => (
              <Card key={i} className="border border-border text-center p-6" data-testid={`card-rule-${rule.category.toLowerCase()}`}>
                <div className="mb-2">
                  {rule.severity === "critical" && <AlertTriangle className="h-8 w-8 mx-auto text-destructive" />}
                  {rule.severity === "warning" && <AlertTriangle className="h-8 w-8 mx-auto text-chart-3" />}
                  {rule.severity === "info" && <CheckCircle className="h-8 w-8 mx-auto text-chart-1" />}
                </div>
                <p className="text-4xl font-bold mb-1">{rule.count}</p>
                <p className="text-sm text-muted-foreground">{rule.category}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/50" data-testid="section-setup">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="text-setup-title">Quick Setup</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get your security infrastructure running in minutes with these simple steps.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {setupSteps.map((step, i) => (
              <SetupCard key={i} step={step} />
            ))}
          </div>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground mb-4 text-center">Install pre-commit hooks locally:</p>
            <CodeBlock code="pip install pre-commit && pre-commit install" />
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-files">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="text-files-title">Configuration Files</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              All security tooling is pre-configured and ready for any tech stack.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { file: ".pre-commit-config.yaml", desc: "Local secret detection" },
              { file: ".gitleaks.toml", desc: "Gitleaks configuration" },
              { file: ".github/workflows/gitleaks.yml", desc: "CI secret scanning" },
              { file: ".github/workflows/semgrep.yml", desc: "SAST workflow" },
              { file: ".github/socket.yml", desc: "Supply chain config" },
              { file: ".github/dependabot.yml", desc: "Dependency updates" },
              { file: "semgrep-rules/*.yaml", desc: "Custom Semgrep rules" },
              { file: "security/headers.js", desc: "HTTP security headers" },
              { file: "SECURITY.md", desc: "Security policy" }
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover-elevate"
                data-testid={`item-file-${i}`}
              >
                <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-mono text-sm truncate">{item.file}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Security Infrastructure</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Production-ready security tooling for any codebase
            </p>
            <div className="flex gap-4">
              <Badge variant="outline" data-testid="badge-footer-status">
                <CheckCircle className="h-3 w-3 mr-1 text-chart-4" />
                All Systems Active
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
