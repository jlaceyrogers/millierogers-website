const lighthouse = require('lighthouse').default;
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runLighthouse(url, name) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);

  // Extract scores
  const { lhr } = runnerResult;
  const scores = {
    performance: lhr.categories.performance.score * 100,
    accessibility: lhr.categories.accessibility.score * 100,
    bestPractices: lhr.categories['best-practices'].score * 100,
    seo: lhr.categories.seo.score * 100,
  };

  // Extract Core Web Vitals
  const metrics = lhr.audits.metrics.details.items[0];
  const coreWebVitals = {
    FCP: metrics.firstContentfulPaint,
    LCP: metrics.largestContentfulPaint,
    TBT: metrics.totalBlockingTime,
    CLS: metrics.cumulativeLayoutShift,
    SI: metrics.speedIndex,
  };

  await chrome.kill();

  return { scores, coreWebVitals, fullReport: lhr };
}

async function main() {
  const port = process.env.PORT || 3000;
  const baseUrl = `http://localhost:${port}`;
  
  const pages = [
    { url: `${baseUrl}/`, name: 'Home' },
    { url: `${baseUrl}/gallery`, name: 'Gallery' },
    { url: `${baseUrl}/contact`, name: 'Contact' },
  ];

  console.log('Running Lighthouse audits...\n');
  
  const results = {};
  
  for (const page of pages) {
    console.log(`Auditing ${page.name} page (${page.url})...`);
    try {
      const result = await runLighthouse(page.url, page.name);
      results[page.name] = result;
      
      console.log(`\n${page.name} Page Results:`);
      console.log('Scores:');
      console.log(`  Performance: ${result.scores.performance.toFixed(0)}`);
      console.log(`  Accessibility: ${result.scores.accessibility.toFixed(0)}`);
      console.log(`  Best Practices: ${result.scores.bestPractices.toFixed(0)}`);
      console.log(`  SEO: ${result.scores.seo.toFixed(0)}`);
      console.log('\nCore Web Vitals:');
      console.log(`  FCP: ${result.coreWebVitals.FCP}ms`);
      console.log(`  LCP: ${result.coreWebVitals.LCP}ms`);
      console.log(`  TBT: ${result.coreWebVitals.TBT}ms`);
      console.log(`  CLS: ${result.coreWebVitals.CLS.toFixed(3)}`);
      console.log(`  Speed Index: ${result.coreWebVitals.SI}ms\n`);
    } catch (error) {
      console.error(`Error auditing ${page.name}:`, error.message);
    }
  }

  // Save detailed results
  const reportPath = path.join(__dirname, '..', 'lighthouse-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nDetailed results saved to: ${reportPath}`);

  // Generate summary report
  generateSummaryReport(results);
}

function generateSummaryReport(results) {
  const reportPath = path.join(__dirname, '..', 'PERFORMANCE_AUDIT.md');
  
  let report = '# Performance Audit Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += '## Summary\n\n';
  
  // Overall scores table
  report += '### Lighthouse Scores\n\n';
  report += '| Page | Performance | Accessibility | Best Practices | SEO |\n';
  report += '|------|-------------|---------------|----------------|-----|\n';
  
  for (const [pageName, result] of Object.entries(results)) {
    const s = result.scores;
    report += `| ${pageName} | ${s.performance.toFixed(0)} | ${s.accessibility.toFixed(0)} | ${s.bestPractices.toFixed(0)} | ${s.seo.toFixed(0)} |\n`;
  }
  
  report += '\n### Core Web Vitals\n\n';
  report += '| Page | FCP (ms) | LCP (ms) | TBT (ms) | CLS | Speed Index (ms) |\n';
  report += '|------|----------|----------|----------|-----|------------------|\n';
  
  for (const [pageName, result] of Object.entries(results)) {
    const cwv = result.coreWebVitals;
    report += `| ${pageName} | ${cwv.FCP} | ${cwv.LCP} | ${cwv.TBT} | ${cwv.CLS.toFixed(3)} | ${cwv.SI} |\n`;
  }
  
  report += '\n## Performance Targets\n\n';
  report += 'According to the design document (Requirements 13.1, 13.3, 13.4):\n\n';
  report += '- **Lighthouse Performance Score**: ≥ 90\n';
  report += '- **First Contentful Paint (FCP)**: < 1.8s\n';
  report += '- **Largest Contentful Paint (LCP)**: < 2.5s\n';
  report += '- **Time to Interactive (TTI)**: < 3.8s\n';
  report += '- **Cumulative Layout Shift (CLS)**: < 0.1\n';
  report += '- **First Input Delay (FID)**: < 100ms\n\n';
  
  report += '## Analysis\n\n';
  
  // Check if targets are met
  let allTargetsMet = true;
  const issues = [];
  
  for (const [pageName, result] of Object.entries(results)) {
    if (result.scores.performance < 90) {
      allTargetsMet = false;
      issues.push(`- ${pageName}: Performance score (${result.scores.performance.toFixed(0)}) is below target (90)`);
    }
    if (result.coreWebVitals.LCP > 2500) {
      allTargetsMet = false;
      issues.push(`- ${pageName}: LCP (${result.coreWebVitals.LCP}ms) exceeds target (2500ms)`);
    }
    if (result.coreWebVitals.CLS > 0.1) {
      allTargetsMet = false;
      issues.push(`- ${pageName}: CLS (${result.coreWebVitals.CLS.toFixed(3)}) exceeds target (0.1)`);
    }
  }
  
  if (allTargetsMet) {
    report += '✅ All performance targets are met!\n\n';
  } else {
    report += '⚠️ Some performance targets are not met:\n\n';
    issues.forEach(issue => report += issue + '\n');
    report += '\n';
  }
  
  report += '## Recommendations\n\n';
  report += 'Based on the audit results, consider the following optimizations:\n\n';
  
  // Add specific recommendations based on results
  const avgPerf = Object.values(results).reduce((sum, r) => sum + r.scores.performance, 0) / Object.keys(results).length;
  
  if (avgPerf < 90) {
    report += '### Performance Optimizations\n\n';
    report += '1. Review and optimize JavaScript bundle size\n';
    report += '2. Implement code splitting for non-critical components\n';
    report += '3. Optimize image loading and formats\n';
    report += '4. Consider lazy loading for below-the-fold content\n';
    report += '5. Minimize render-blocking resources\n\n';
  }
  
  fs.writeFileSync(reportPath, report);
  console.log(`Summary report saved to: ${reportPath}`);
}

main().catch(console.error);
