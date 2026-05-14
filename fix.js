const fs = require('fs');
const files = [
  'app/dashboard/tools/career/resume-builder/page.tsx',
  'app/dashboard/tools/education/assignment/page.tsx',
  'app/dashboard/tools/image/background-remove/page.tsx',
  'app/dashboard/tools/image/text-to-image/page.tsx',
  'app/dashboard/tools/text/caption-generator/page.tsx',
  'app/dashboard/tools/text/chatbot/page.tsx',
  'app/dashboard/tools/text/email-writer/page.tsx',
  'app/dashboard/tools/text/grammar-check/page.tsx',
  'app/dashboard/tools/text/summarize/page.tsx',
  'app/dashboard/tools/text/translate/page.tsx',
  'app/dashboard/tools/video/generate/page.tsx',
];
files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    content = content.replace(/const MODELS\s*=\s*\[[\s\S]*?\];/g, 'const MODELS: any[] = [];');
    content = content.replace(/\s*const \[selectedModel,\s*setSelectedModel\]\s*=\s*useState\([^)]*\);\n?/g, '\n');
    content = content.replace(/\s*useEffect\(\(\)\s*=>\s*\{\s*\n?\s*const saved\s*=\s*localStorage\.getItem\([^)]*\);\s*\n?\s*if \(saved\)\s*setSelectedModel\(saved\);\s*\n?\s*\},\s*\[\]\);\n?/g, '');
    content = content.replace(/\s*const handleModelChange\s*=\s*[\s\S]*?localStorage\.setItem\([^;]*;\s*\n?\s*\};\n?/g, '');
    content = content.replace(/,\s*model:\s*selectedModel/g, '');
    content = content.replace(/model:\s*selectedModel,?\s*/g, '');
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('✅ Done:', filePath);
    } else {
      console.log('⚠️ No change:', filePath);
    }
  } catch (e) {
    console.log('❌ Error:', filePath, e.message);
  }
});
console.log('শেষ!');
