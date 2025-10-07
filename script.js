// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "dark";
body.setAttribute("data-theme", savedTheme);

themeToggle.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
});

// Formula Database
const formulaDatabase = [
    {
        name: "Quadratic Formula",
        formula: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
        category: "algebra",
        difficulty: "intermediate",
        description: "Solution for ax + bx + c = 0",
        tags: ["equations", "roots", "polynomial"],
        icon: ""
    },
    {
        name: "Binomial Theorem",
        formula: "(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k",
        category: "algebra",
        difficulty: "advanced",
        description: "Expansion of binomial expressions",
        tags: ["expansion", "combinatorics"],
        icon: ""
    },
    {
        name: "Difference of Squares",
        formula: "a^2 - b^2 = (a + b)(a - b)",
        category: "algebra",
        difficulty: "beginner",
        description: "Factorization formula",
        tags: ["factorization", "identity"],
        icon: ""
    },
    {
        name: "Perfect Square",
        formula: "(a \\pm b)^2 = a^2 \\pm 2ab + b^2",
        category: "algebra",
        difficulty: "beginner",
        description: "Square of binomial",
        tags: ["expansion", "identity"],
        icon: ""
    },
    {
        name: "Derivative Power Rule",
        formula: "\\frac{d}{dx}(x^n) = nx^{n-1}",
        category: "calculus",
        difficulty: "beginner",
        description: "Derivative of power functions",
        tags: ["derivative", "differentiation"],
        icon: ""
    },
    {
        name: "Product Rule",
        formula: "\\frac{d}{dx}[f(x)g(x)] = f'(x)g(x) + f(x)g'(x)",
        category: "calculus",
        difficulty: "intermediate",
        description: "Derivative of product",
        tags: ["derivative", "rules"],
        icon: ""
    },
    {
        name: "Chain Rule",
        formula: "\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)",
        category: "calculus",
        difficulty: "intermediate",
        description: "Derivative of composition",
        tags: ["derivative", "composition"],
        icon: ""
    },
    {
        name: "Integration by Parts",
        formula: "\\int u\\,dv = uv - \\int v\\,du",
        category: "calculus",
        difficulty: "advanced",
        description: "Integration technique",
        tags: ["integration", "techniques"],
        icon: ""
    },
    {
        name: "Fundamental Theorem",
        formula: "\\int_a^b f'(x)\\,dx = f(b) - f(a)",
        category: "calculus",
        difficulty: "intermediate",
        description: "Connection between derivative and integral",
        tags: ["integration", "fundamental"],
        icon: ""
    },
    {
        name: "Pythagorean Theorem",
        formula: "a^2 + b^2 = c^2",
        category: "geometry",
        difficulty: "beginner",
        description: "Right triangle relationship",
        tags: ["triangle", "theorem"],
        icon: ""
    },
    {
        name: "Circle Area",
        formula: "A = \\pi r^2",
        category: "geometry",
        difficulty: "beginner",
        description: "Area of a circle",
        tags: ["circle", "area"],
        icon: ""
    },
    {
        name: "Sphere Volume",
        formula: "V = \\frac{4}{3}\\pi r^3",
        category: "geometry",
        difficulty: "intermediate",
        description: "Volume of a sphere",
        tags: ["sphere", "volume", "3D"],
        icon: ""
    },
    {
        name: "Triangle Area",
        formula: "A = \\frac{1}{2}bh",
        category: "geometry",
        difficulty: "beginner",
        description: "Area of triangle",
        tags: ["triangle", "area"],
        icon: ""
    },
    {
        name: "Sine Law",
        formula: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}",
        category: "trigonometry",
        difficulty: "intermediate",
        description: "Relationship in any triangle",
        tags: ["triangle", "sine"],
        icon: ""
    },
    {
        name: "Cosine Law",
        formula: "c^2 = a^2 + b^2 - 2ab\\cos C",
        category: "trigonometry",
        difficulty: "intermediate",
        description: "Generalized Pythagorean theorem",
        tags: ["triangle", "cosine"],
        icon: ""
    },
    {
        name: "Pythagorean Identity",
        formula: "\\sin^2\\theta + \\cos^2\\theta = 1",
        category: "trigonometry",
        difficulty: "beginner",
        description: "Fundamental trig identity",
        tags: ["identity", "basic"],
        icon: ""
    },
    {
        name: "Double Angle (Sine)",
        formula: "\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta",
        category: "trigonometry",
        difficulty: "intermediate",
        description: "Double angle formula for sine",
        tags: ["identity", "double-angle"],
        icon: "2"
    },
    {
        name: "Newtons Second Law",
        formula: "F = ma",
        category: "physics",
        difficulty: "beginner",
        description: "Force equals mass times acceleration",
        tags: ["mechanics", "force"],
        icon: ""
    },
    {
        name: "Kinetic Energy",
        formula: "E_k = \\frac{1}{2}mv^2",
        category: "physics",
        difficulty: "beginner",
        description: "Energy of motion",
        tags: ["energy", "mechanics"],
        icon: ""
    },
    {
        name: "Einsteins Mass-Energy",
        formula: "E = mc^2",
        category: "physics",
        difficulty: "advanced",
        description: "Mass-energy equivalence",
        tags: ["relativity", "energy"],
        icon: ""
    },
    {
        name: "Gravitational Force",
        formula: "F = G\\frac{m_1m_2}{r^2}",
        category: "physics",
        difficulty: "intermediate",
        description: "Universal gravitation",
        tags: ["gravity", "force"],
        icon: ""
    },
    {
        name: "Wave Equation",
        formula: "v = f\\lambda",
        category: "physics",
        difficulty: "beginner",
        description: "Wave velocity relationship",
        tags: ["waves", "motion"],
        icon: ""
    },
    {
        name: "Mean (Average)",
        formula: "\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i",
        category: "statistics",
        difficulty: "beginner",
        description: "Average of a dataset",
        tags: ["average", "central tendency"],
        icon: ""
    },
    {
        name: "Standard Deviation",
        formula: "\\sigma = \\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2}",
        category: "statistics",
        difficulty: "intermediate",
        description: "Measure of spread",
        tags: ["variance", "spread"],
        icon: ""
    },
    {
        name: "Normal Distribution",
        formula: "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}",
        category: "statistics",
        difficulty: "advanced",
        description: "Bell curve probability density",
        tags: ["probability", "distribution"],
        icon: ""
    }
];

let currentCategory = "all";
let currentDifficulty = "all";
let currentSearchType = "all";

function performSearch(query) {
    query = query.toLowerCase().trim();
    
    if (!query) {
        displayResults(formulaDatabase);
        return;
    }
    
    const results = formulaDatabase.filter(formula => {
        if (currentCategory !== "all" && formula.category !== currentCategory) {
            return false;
        }
        
        if (currentDifficulty !== "all" && formula.difficulty !== currentDifficulty) {
            return false;
        }
        
        const searchIn = [
            formula.name.toLowerCase(),
            formula.description.toLowerCase(),
            ...formula.tags,
            formula.formula.toLowerCase()
        ].join(" ");
        
        return searchIn.includes(query);
    });
    
    displayResults(results);
}

function displayResults(results) {
    const resultsContainer = document.getElementById("searchResults");
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem;"></div>
                <h3>No formulas found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = results.map(formula => `
        <div class="result-card">
            <div class="result-title">${formula.icon} ${formula.name}</div>
            <div class="result-formula">$$${formula.formula}$$</div>
            <p class="result-description">${formula.description}</p>
            <div class="result-tags">
                ${formula.tags.map(tag => `<span class="tag">#${tag}</span>`).join("")}
                <span class="tag"> ${formula.category}</span>
                <span class="tag"> ${formula.difficulty}</span>
            </div>
        </div>
    `).join("");
    
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

const searchInputLarge = document.getElementById("searchInputLarge");
const searchBtnLarge = document.getElementById("searchBtnLarge");
const searchInputAdvanced = document.getElementById("searchInputAdvanced");
const searchBtnAdvanced = document.getElementById("searchBtnAdvanced");

searchBtnLarge.addEventListener("click", () => {
    const query = searchInputLarge.value;
    performSearch(query);
    document.getElementById("search").scrollIntoView({ behavior: "smooth" });
});

searchInputLarge.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtnLarge.click();
    }
});

searchBtnAdvanced.addEventListener("click", () => {
    const query = searchInputAdvanced.value;
    performSearch(query);
});

searchInputAdvanced.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtnAdvanced.click();
    }
});

document.getElementById("searchType").addEventListener("change", (e) => {
    currentSearchType = e.target.value;
    performSearch(searchInputAdvanced.value);
});

document.getElementById("categoryFilter").addEventListener("change", (e) => {
    currentCategory = e.target.value;
    performSearch(searchInputAdvanced.value);
});

document.getElementById("difficultyFilter").addEventListener("change", (e) => {
    currentDifficulty = e.target.value;
    performSearch(searchInputAdvanced.value);
});

document.querySelectorAll(".example-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const example = btn.textContent;
        searchInputLarge.value = example;
        searchInputAdvanced.value = example;
        performSearch(example);
        document.getElementById("search").scrollIntoView({ behavior: "smooth" });
    });
});

const categoryBtns = document.querySelectorAll(".category-btn");
const formulasGrid = document.getElementById("formulasGrid");

function displayFormulas(category) {
    const formulas = category === "all" 
        ? formulaDatabase 
        : formulaDatabase.filter(f => f.category === category);
    
    formulasGrid.innerHTML = formulas.map(formula => `
        <div class="formula-card">
            <div class="formula-header">
                <span class="formula-icon">${formula.icon}</span>
                <h3 class="formula-name">${formula.name}</h3>
            </div>
            <div class="formula-content">$$${formula.formula}$$</div>
            <span class="formula-category">${formula.category}</span>
        </div>
    `).join("");
    
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        categoryBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const category = btn.dataset.category;
        displayFormulas(category);
    });
});

const calcInput = document.getElementById("calcInput");
const calcResult = document.getElementById("calcResult");
const calcButtons = document.querySelectorAll(".calc-btn");

let currentExpression = "";
let lastResult = "";

calcButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.textContent;
        
        if (value === "C") {
            currentExpression = "";
            calcInput.value = "";
            calcResult.textContent = "0";
        } else if (value === "") {
            currentExpression = currentExpression.slice(0, -1);
            calcInput.value = currentExpression;
        } else if (value === "=") {
            try {
                let expr = currentExpression
                    .replace(/π/g, "Math.PI")
                    .replace(/e/g, "Math.E")
                    .replace(/sin/g, "Math.sin")
                    .replace(/cos/g, "Math.cos")
                    .replace(/tan/g, "Math.tan")
                    .replace(/log/g, "Math.log10")
                    .replace(/ln/g, "Math.log")
                    .replace(//g, "Math.sqrt")
                    .replace(/\^/g, "**");
                
                const result = eval(expr);
                calcResult.textContent = Number(result.toFixed(10));
                lastResult = result.toString();
            } catch (error) {
                calcResult.textContent = "Error";
            }
        } else {
            currentExpression += value;
            calcInput.value = currentExpression;
        }
    });
});

calcInput.addEventListener("input", () => {
    currentExpression = calcInput.value;
});

calcInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        document.querySelector(".calc-btn.operator").click();
    }
});

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
            
            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        }
    });
});

window.addEventListener("DOMContentLoaded", () => {
    displayFormulas("all");
    displayResults(formulaDatabase);
    
    window.MathJax = {
        tex: {
            inlineMath: [["$", "$"], ["\\(", "\\)"]],
            displayMath: [["$$", "$$"], ["\\[", "\\]"]]
        },
        startup: {
            ready: () => {
                MathJax.startup.defaultReady();
                MathJax.typesetPromise();
            }
        }
    };
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".formula-card, .result-card, .stat-card, .feature-item");
    cards.forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(card);
    });
});
