// preprocess.js
const fs = require('fs');
const path = require('path');

const ANIMATE_DIR = path.join(__dirname, 'public', 'animates');
const OUTPUT_FILE = path.join(__dirname, 'src', 'resource', 'animatesData.ts');

function loadAnimateData() {
    console.log('loading animates data, animates dir:', ANIMATE_DIR);
    let animates = {};

    const ANIMATE_LIST = fs.readdirSync(ANIMATE_DIR).filter(file => file.endsWith('.animate'));
    console.log(`animate list: ${ANIMATE_LIST.join(', ')}`);
    ANIMATE_LIST.forEach((name) => {
        console.log(`preprocessing ${name}...`);
        const filePath = path.join(ANIMATE_DIR, `${name}`);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            try {
                const parsedContent = JSON.parse(content);
                console.log(`parsed ${name}:`, parsedContent);
                animates[name.slice(0, -8)] = {
                    ratio: parsedContent.ratio,
                    images: parsedContent.bitmaps,
                    frame: parsedContent.frame_max,
                    frames: parsedContent.frames.map(frame =>
                        frame.map(t3 => ({
                            index: t3[0],
                            x: t3[1],
                            y: t3[2],
                            zoom: t3[3],
                            opacity: t3[4],
                            mirror: t3[5] || 0,
                            angle: t3[6] || 0,
                        }))
                    ),
                };
            } catch (err) {
                console.error(`Error parsing ${name}.animate:`, err);
            }
        }
    });

    return animates;
}

function generateTypeScriptFile(animates) {
    console.log(`generating ${OUTPUT_FILE}...`);
    console.log(`animates data:`, animates);
    const content = `export const animateResource = ${JSON.stringify(animates, null, 2)};`;
    // 如果OUTPUT_FILE存在，则先删除
    if (fs.existsSync(OUTPUT_FILE)) {
        fs.rmSync(OUTPUT_FILE, { force: true });
    }
    fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
}

generateTypeScriptFile(loadAnimateData());
