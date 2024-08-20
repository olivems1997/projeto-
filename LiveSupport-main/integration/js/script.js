document.addEventListener("DOMContentLoaded", () => {
    const chatBtn = document.querySelector(".chatBtn");
    const shapeBtns = document.querySelectorAll(".shapeBtn");
    const sizeSlider = document.getElementById("sizeSlider");
    const currentSizeSpan = document.getElementById("currentSize");
    const solidColorInput = document.getElementById("solidColor");
    const gradientStartInput = document.getElementById("gradientStart");
    const gradientMiddleInput = document.getElementById("gradientMiddle");
    const gradientEndInput = document.getElementById("gradientEnd");
    const gradientColors = document.getElementById("gradientColors");
    const pathColorInput = document.getElementById("pathColor");
    const tooltipBgColorInput = document.getElementById("tooltipBgColor");
    const tooltipTextColorInput = document.getElementById("tooltipTextColor");
    const styleSelect = document.getElementById("styleSelect");
    const tooltipSelect = document.getElementById("tooltipSelect");
    const svgPath = chatBtn.querySelector("svg path");
    const positionSelect = document.getElementById("positionSelect");

    let tooltip = chatBtn.querySelector(".tooltip");
    let buttonPosition = "20px-20px"; // Posição padrão
    let selectedShape = "circle";

    const themeSwitch = document.getElementById("theme-switch");
    const themeContainer = document.getElementById("theme-container");
    const colorHexSpan = document.querySelector(".color-hex");
    const colorPickerInput = document.getElementById("color5123123");
    const colorPickerLabel = document.querySelector(".color-picker-label");

    const confirmCustomizationButton = document.getElementById("confirmCustomization");
    const backButton = document.getElementById("backButton");
    const languageButtons = document.getElementById("languageButtons");
    const generatedCodeContainer = document.getElementById("generatedCode");
    const codeElement = document.getElementById("code");
    const copyCodeButton = document.getElementById("copyCodeButton");

    let currentScale = 1.0;
    let currentLanguage = 'html';

    // Função para atualizar gradiente
    function updateGradient() {
        if (styleSelect.value === "gradient") {
            chatBtn.style.background = `linear-gradient(147deg, ${gradientStartInput.value}, ${gradientMiddleInput.value}, ${gradientEndInput.value})`;
            chatBtn.classList.add("gradient");
        }
    }

    // Inicializar com a cor sólida e o conteúdo padrão do tooltip
    if (styleSelect.value === "solid") {
        chatBtn.style.background = solidColorInput.value;
        chatBtn.classList.remove("gradient");
    } else {
        updateGradient();
        gradientColors.style.display = "block";
    }
    svgPath.setAttribute("fill", pathColorInput.value);
    tooltip.style.backgroundColor = tooltipBgColorInput.value;
    tooltip.style.color = tooltipTextColorInput.value;
    tooltip.textContent = "Chat";

    // Adicionar funcionalidade de alternância de tema
    themeContainer.classList.add("light");

    themeSwitch.addEventListener("change", () => {
        if (themeSwitch.checked) {
            themeContainer.classList.remove("dark");
            themeContainer.classList.add("light");
        } else {
            themeContainer.classList.remove("light");
            themeContainer.classList.add("dark");
        }
        updateColorHex();
        updateTextColor();
    });

    // Atualizar a cor do fundo e o texto do span ao selecionar uma cor
    colorPickerInput.addEventListener("input", () => {
        const selectedColor = colorPickerInput.value;
        themeContainer.style.backgroundColor = selectedColor;
        colorPickerLabel.style.backgroundColor = selectedColor;
        colorHexSpan.textContent = selectedColor;
        updateTextColor();
    });

    // Função para atualizar a cor hexadecimal no span
    function updateColorHex() {
        const currentColor = getComputedStyle(themeContainer).getPropertyValue('background-color');
        colorHexSpan.textContent = rgbToHex(currentColor);
    }

    // Função para converter rgb para hex
    function rgbToHex(rgb) {
        const result = rgb.match(/\d+/g);
        return "#" + ((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2])).toString(16).slice(1).toUpperCase();
    }

    // Função para atualizar a cor do texto para garantir contraste
    function updateTextColor() {
        const bgColor = getComputedStyle(themeContainer).getPropertyValue('background-color');
        const luminance = getLuminance(bgColor);
        if (luminance > 0.5) {
            colorHexSpan.style.color = '#000000'; // cor escura para fundo claro
        } else {
            colorHexSpan.style.color = '#FFFFFF'; // cor clara para fundo escuro
        }
    }

    // Função para calcular a luminância de uma cor
    function getLuminance(color) {
        const rgb = color.match(/\d+/g).map(Number);
        const [r, g, b] = rgb.map(c => {
            c /= 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    // Inicializar com a cor correta
    updateColorHex();
    updateTextColor();

    // Função para gerar o código HTML do botão personalizado
function generateHTMLCode(chatBtn, empresaId) { 
    const clonedBtn = chatBtn.cloneNode(true);
    clonedBtn.classList.add(selectedShape);
  
    const wrapper = document.createElement('div');
    wrapper.appendChild(clonedBtn);
    return wrapper.innerHTML.replace(/></g, '>\n  <');
  }

    // Função para gerar o código CSS do botão personalizado
    function generateCSSCode(chatBtn) {
        const [bottom, right] = buttonPosition.split("-");
        return `
    .chatBtn {
        width: 55px;
        height: 55px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        padding-top: 3px;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.164);
        position: fixed;
        bottom: ${bottom};
        right: ${right};
        background-size: 300%;
        background-position: left;
        transition-duration: 1s;
        background: ${chatBtn.style.background};
        transform: scale(${currentScale});
    }
    
    .tooltip {
        position: absolute;
        top: -40px;
        opacity: 0;
        background-color: ${tooltipBgColorInput.value};
        color: ${tooltipTextColorInput.value};
        padding: 5px 10px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition-duration: .5s;
        pointer-events: none;
        letter-spacing: 0.5px;
    }
    
    .chatBtn:hover .tooltip {
        opacity: 1;
        transition-duration: .5s;
    }
    
    .chatBtn:hover {
        background-position: right;
        transition-duration: 1s;
    }

    .chatBtn.${selectedShape} {
        ${getShapeCSS(selectedShape)}
    }
    `;
    }

    // Função para obter o CSS específico para cada formato de botão
    function getShapeCSS(shape) {
        switch (shape) {
            case 'circle':
                return 'border-radius: 50%;';
            case 'square':
                return 'border-radius: 0;';
            case 'diamond':
                return 'clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);';
            case 'triangle':
                return 'width: 0; height: 0; border-left: 30px solid transparent; border-right: 30px solid transparent; border-bottom: 55px solid #FFE53B; background: none;';
            case 'hexagon':
                return 'clip-path: polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%);';
            case 'star':
                return 'clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);';
            case 'oval':
                return 'width: 80px; height: 55px; border-radius: 50% / 50%;';
            default:
                return '';
        }
    }

    // Função para gerar o código completo do botão personalizado
    function generateCode(language) {
        const chatBtnClone = chatBtn.cloneNode(true);
        const urlParams = new URLSearchParams(window.location.search);
        const empresaId = urlParams.get('empresaId');
        const htmlCode = generateHTMLCode(chatBtnClone, empresaId); // Passar empresaId para generateHTMLCode
        const cssCode = generateCSSCode(chatBtnClone);
      
        let code = '';
        switch (language) {
            case 'html':
                return `<style>\n${cssCode}\n</style>\n<a href="../chatbot/chatbot.html?empresaId=${empresaId}">\n  ${htmlCode}\n</a>`;
              case 'javascript':
                return `<script>\ndocument.write('<a href="../chatbot/chatbot.html?empresaId=${empresaId}">\\n  ${htmlCode}\\n</a>');\n${cssCode}\n</script>`;
              case 'react':
                return `import React from 'react';\n\nconst Button = () => (\n  <a href="../chatbot/chatbot.html?empresaId=${empresaId}">\n    ${htmlCode}\n  </a>\n);\n\nexport default Button;\n\n/* Component Styles */\n${cssCode}`;
            case 'angular':
                return `<a href="../chatbot/chatbot.html?empresaId=${empresaId}">\n  ${htmlCode}\n</a>\n\n/* Component Styles */\n${cssCode}`;
            case 'vue':
                return `<template>\n  <a href="../chatbot.html?empresaId=${empresaId}">\n    ${htmlCode}\n  </a>\n</template>\n\n<script>\nexport default {\n  name: 'Button'\n};\n</script>\n\n<style scoped>\n${cssCode}\n</style>`;
            case 'svelte':
                return `<script>\n  // Add your script here\n</script>\n\n<a href="../chatbot/chatbot.html?empresaId=${empresaId}">\n  ${htmlCode}\n</a>\n\n<style>\n${cssCode}\n</style>`;
            case 'php':
                return `<?php\n  echo '<a href="../chatbot/chatbot.html?empresaId=${empresaId}">';\n  echo '${htmlCode}';\n  echo '</a>';\n?>\n\n<style>${cssCode}</style>`;
            case 'python':
                return `from flask import Flask, render_template_string\n\napp = Flask(__name__)\n\n@app.route('/')\ndef index():\n  return render_template_string("""\n<a href="../chatbot/chatbot.html?empresaId=${empresaId}">\n  ${htmlCode}\n</a>\n\n<style>${cssCode}\n""")\n\nif __name__ == '__main__':\n  app.run(debug=True)`;
            case 'ruby':
                return `require 'sinatra'\n\nget '/' do\n  erb :index\nend\n\n__END__\n\n@@ index\n<a href="../chatbot/chatbot.html?empresaId=${empresaId}">\n  ${htmlCode}\n</a>\n\n<style>${cssCode}</style>`;
            case 'java':
                return `@RestController\npublic class ButtonController {\n  @GetMapping("/")\n  public String button() {\n    return "<a href=\\"../chatbot/chatbot.html?empresaId=${empresaId}\\">"\n           + "${htmlCode}"\n           + "</a>";\n  }\n}\n\n/* CSS */\n${cssCode}`;
            case 'csharp':
                return `@page "/button"\n\n<a href="../chatbot/chatbot.html?empresaId=${empresaId}">\n  ${htmlCode}\n</a>\n\n<style>\n${cssCode}\n</style>`;
            case 'typescript':
                return `const button: string = \`<a href="../chatbot/chatbot.html?empresaId=${empresaId}">\n  ${htmlCode}\n</a>\`;\n\n// Styles\nconst styles: string = \`${cssCode}\`;`;
            case 'perl':
                return `use Dancer2;\n\nget '/' => sub {\n  template 'index' => { button => '<a href="../chatbot/chatbot.html?empresaId=${empresaId}">${htmlCode}</a>' };\n};\n\nstart;\n\n__END__\n\n@@ index\n<a href="../chatbot.html?empresaId=${empresaId}">\n  ${htmlCode}\n</a>\n\n<style>${cssCode}</style>`;
            case 'go':
                return `package main\n\nimport (\n  "fmt"\n  "net/http"\n)\n\nfunc button(w http.ResponseWriter, r *http.Request) {\n  fmt.Fprintf(w,\n    "<a href=\\"../chatbot/chatbot.html?empresaId=%s\\">"\n    +"%s"\n    +"</a>", "${empresaId}", "${htmlCode}")\n}\n\nfunc main() {\n  http.HandleFunc("/", button)\n  http.ListenAndServe(":8080, nil)\n}`;
            case 'nodejs':
                return `const express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => {\n  res.send(\n    '<a href="../chatbot/chatbot.html?empresaId=${empresaId}">'\n    + '${htmlCode}'\n    + '</a>'\n  );\n});\n\napp.listen(3000, () => {\n  console.log('Server running on port 3000');\n});\n\n/* CSS */\n${cssCode}`;
            case 'coldfusion':
                return `<cfoutput>\n  <a href="../chatbot/chatbot.html?empresaId=${empresaId}">\n    ${htmlCode}\n  </a>\n</cfoutput>\n\n<style>${cssCode}</style>`;
            case 'lua':
                return `local lapis = require("lapis")\nlocal app = lapis.Application()\n\napp:get("/", function()\n  return "<a href=\\"../chatbot/chatbot.html?empresaId=${empresaId}\\">"\n         + "${htmlCode}"\n         + "</a>\n  <style>\n    ${cssCode}\n  </style>"\nend)\n\nreturn app`;
            case 'scala':
                return `import play.api.mvc._\n\nclass ButtonController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {\n  def button = Action {\n    Ok("<a href=\\"../chatbot/chatbot.html?empresaId=${empresaId}\\">"\n       + "${htmlCode}"\n       + "</a>")\n  }\n}\n\n/* CSS */\n${cssCode}`;
        }
      
        return code;
      }

    // Função para exibir o código gerado
    function displayCode(language) {
        const code = generateCode(language);
        codeElement.textContent = code;
        Prism.highlightAll();
        generatedCodeContainer.classList.remove("hidden");
        backButton.classList.remove("hidden");
        currentLanguage = language;
        // updateLanguageButtonStyles();
    }

    // Função para copiar o código para a área de transferência
    function copyCodeToClipboard() {
        const code = codeElement.textContent;
        navigator.clipboard.writeText(code);
    }

    // Event listeners
    document.querySelectorAll('.language-btn').forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            displayCode(lang);
        });
    });

    confirmCustomizationButton.addEventListener("click", () => {
        // Atualize a variável selectedShape com a classe do botão ativo
        selectedShape = document.querySelector('.shapeBtn.active').getAttribute('data-shape');
        
        
        // Atualiza o estilo de fundo baseado na seleção
        if (styleSelect.value === "solid") {
            chatBtn.style.background = solidColorInput.value;
            chatBtn.classList.remove("gradient");
        } else {
            updateGradient();
        }
    
        // Atualiza o tamanho do botão
        chatBtn.style.transform = `scale(${currentScale})`;
    
        // Atualiza a cor do caminho do SVG
        svgPath.setAttribute("fill", pathColorInput.value);
    
        // Atualiza as cores do tooltip
        tooltip.style.backgroundColor = tooltipBgColorInput.value;
        tooltip.style.color = tooltipTextColorInput.value;
        tooltip.textContent = tooltipSelect.value !== "No content" ? tooltipSelect.value : "";
    
        // Exibe a área de botões de linguagem e código gerado
        languageButtons.classList.remove("hidden");
        generatedCodeContainer.classList.remove("hidden");
        backButton.classList.remove("hidden");
    
        // Esconde o painel de personalização
        document.querySelector(".customization-panel").classList.add("hidden");
    
        // Gera e exibe o código na linguagem atual
        displayCode(currentLanguage);
    });
    
    
    

    backButton.addEventListener("click", () => {
        languageButtons.classList.add("hidden");
        generatedCodeContainer.classList.add("hidden");
        backButton.classList.add("hidden");
        document.querySelector(".customization-panel").classList.remove("hidden");
    });

    copyCodeButton.addEventListener('click', copyCodeToClipboard);

    // Atualizações relacionadas ao tema e personalização
    shapeBtns.forEach(button => {
        button.addEventListener("click", () => {
            chatBtn.classList.remove(selectedShape);
            selectedShape = button.getAttribute("data-shape");
            chatBtn.classList.add(selectedShape);
    
            if (styleSelect.value === "gradient") {
                chatBtn.classList.add("gradient");
            }
    
            chatBtn.style.transform = `scale(${currentScale})`;
            shapeBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    
    
    

    sizeSlider.addEventListener("input", () => {
        currentScale = sizeSlider.value;
        chatBtn.style.transform = `scale(${currentScale})`;
        currentSizeSpan.textContent = currentScale;
    });

    solidColorInput.addEventListener("input", () => {
        if (styleSelect.value === "solid") {
            chatBtn.style.background = solidColorInput.value;
            chatBtn.classList.remove("gradient");
        }
    });

    positionSelect.addEventListener("change", () => {
        buttonPosition = positionSelect.value;
    });

    gradientStartInput.addEventListener("input", updateGradient);
    gradientMiddleInput.addEventListener("input", updateGradient);
    gradientEndInput.addEventListener("input", updateGradient);

    styleSelect.addEventListener("change", () => {
        if (styleSelect.value === "solid") {
            chatBtn.style.background = solidColorInput.value;
            chatBtn.classList.remove("gradient");
            gradientStartInput.parentElement.style.display = "none";
            gradientMiddleInput.parentElement.style.display = "none";
            gradientEndInput.parentElement.style.display = "none";
            solidColorInput.parentElement.style.display = "block";
        } else {
            updateGradient();
            gradientStartInput.parentElement.style.display = "block";
            gradientMiddleInput.parentElement.style.display = "block";
            gradientEndInput.parentElement.style.display = "block";
            solidColorInput.parentElement.style.display = "none";
        }
    });

    pathColorInput.addEventListener("input", () => {
        svgPath.setAttribute("fill", pathColorInput.value);
    });

    tooltipBgColorInput.addEventListener("input", () => {
        tooltip.style.backgroundColor = tooltipBgColorInput.value;
    });

    tooltipTextColorInput.addEventListener("input", () => {
        tooltip.style.color = tooltipTextColorInput.value;
    });

    tooltipSelect.addEventListener("change", () => {
        if (tooltipSelect.value === "No content") {
            tooltip.style.display = "none";
            tooltipBgColorInput.parentElement.style.display = "none";
            tooltipTextColorInput.parentElement.style.display = "none";
        } else {
            tooltip.style.display = "block";
            tooltipBgColorInput.parentElement.style.display = "block";
            tooltipTextColorInput.parentElement.style.display = "block";
            tooltip.textContent = tooltipSelect.value;
        }
    });

    // Inicializar tooltip como "No content"
    tooltipSelect.value = "No content";
    tooltip.style.display = "none";
    tooltipBgColorInput.parentElement.style.display = "none";
    tooltipTextColorInput.parentElement.style.display = "none";

    // Inicializar com cor sólida
    chatBtn.style.background = solidColorInput.value;
    chatBtn.classList.remove("gradient");
    gradientStartInput.parentElement.style.display = "none";
    gradientMiddleInput.parentElement.style.display = "none";
    gradientEndInput.parentElement.style.display = "none";
    solidColorInput.parentElement.style.display = "block";

    
    
});

const voltar = document.getElementById("voltar")
voltar.addEventListener("click", function() {
    window.location.href = "../index.html"
})