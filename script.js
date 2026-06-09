// ==================== VARIÁVEIS GLOBAIS ====================
let resources = {
    credits: 1250,
    energy: 420,
    water: 380,
    sustainability: 68
};

let day = 1;
let selectedCrop = null;
let livestock = 4;
let plots = [];

const crops = [
    {
        id: 'quantum_corn',
        name: 'Milho Quântico',
        emoji: '🌽',
        description: 'Editado com tecnologia quântica. Cresce 3x mais rápido.',
        cost: { energy: 38, water: 22 },
        growthPerDay: 38,
        yield: { credits: 185, sustain: 4 }
    },
    {
        id: 'hydro_lettuce',
        name: 'Alface Hidropônica',
        emoji: '🥬',
        description: '95% de economia de água. Máxima sustentabilidade.',
        cost: { energy: 22, water: 8 },
        growthPerDay: 30,
        yield: { credits: 125, sustain: 9 }
    },
    {
        id: 'bio_tomato',
        name: 'Tomate Bioluminescente',
        emoji: '🍅',
        description: 'Produz luz e nutrientes extras. Alto lucro.',
        cost: { energy: 52, water: 32 },
        growthPerDay: 24,
        yield: { credits: 265, sustain: 2 }
    },
    {
        id: 'energy_algae',
        name: 'Algas Bioenergéticas',
        emoji: '🦠',
        description: 'Produz energia limpa + biomassa comestível.',
        cost: { energy: 28, water: 38 },
        growthPerDay: 42,
        yield: { credits: 95, energy: 55, sustain: 7 }
    }
];

// ==================== INICIALIZAÇÃO ====================
function init() {
    // Criar 6 parcelas
    plots = [];
    for (let i = 0; i < 6; i++) {
        plots.push({
            id: i,
            cropId: null,
            progress: 0,
            isReady: false,
            plantedDay: 0
        });
    }
    
    renderFarm();
    renderCropSelector();
    updateResourcesUI();
    updateLivestockUI();
    
    // Mensagem de boas-vindas
    setTimeout(() => {
        showToast("Bem-vindo à Fazenda do Futuro!", "Selecione uma cultura e clique em uma parcela vazia para começar.", "🌱");
    }, 1200);
}

// ==================== RENDERIZAR FAZENDA ====================
function renderFarm() {
    const grid = document.getElementById('farm-grid');
    grid.innerHTML = '';
    
    plots.forEach(plot => {
        const card = document.createElement('div');
        card.className = `plot-card bg-slate-800 border border-slate-600 hover:border-emerald-500/60 rounded-3xl p-5 flex flex-col cursor-pointer min-h-[178px]`;
        
        if (plot.isReady) {
            card.classList.add('ready', 'border-yellow-400');
        }
        
        let html = '';
        
        if (!plot.cropId) {
            html = `
                <div class="flex-1 flex flex-col items-center justify-center text-center">
                    <div class="text-6xl mb-3 opacity-30">🟫</div>
                    <div class="font-semibold text-slate-300">Parcela Vazia</div>
                    <div class="text-xs text-slate-500 mt-1">Clique para plantar</div>
                </div>
            `;
        } else {
            const crop = crops.find(c => c.id === plot.cropId);
            const progress = Math.min(plot.progress, 100);
            const isReady = plot.isReady || progress >= 100;
            
            html = `
                <div class="flex justify-between items-start">
                    <div>
                        <div class="text-5xl mb-1">${crop.emoji}</div>
                        <div class="font-semibold leading-tight text-[15px]">${crop.name}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-[10px] px-2.5 py-px bg-slate-700 rounded-full text-slate-400">DIA ${plot.plantedDay}</div>
                    </div>
                </div>
                
                <div class="mt-auto pt-4">
                    <div class="flex justify-between items-center text-xs mb-1.5">
                        <span class="text-slate-400">Crescimento</span>
                        <span class="font-mono font-bold ${isReady ? 'text-yellow-400' : 'text-emerald-400'}">${Math.floor(progress)}%</span>
                    </div>
                    
                    <div class="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                        <div class="h-full transition-all duration-300 ${isReady ? 'bg-yellow-400' : 'bg-gradient-to-r from-emerald-400 to-teal-400'}" 
                             style="width: ${progress}%"></div>
                    </div>
                    
                    ${isReady ? 
                        `<div class="mt-3 text-center"><span class="inline-block text-xs font-bold px-4 py-1 bg-yellow-400 text-yellow-950 rounded-2xl">PRONTO PARA COLHER</span></div>` : 
                        `<div class="text-center text-[10px] text-slate-500 mt-2">Colheita em ~${Math.ceil((100 - progress) / crop.growthPerDay)} dias</div>`
                    }
                </div>
            `;
        }
        
        card.innerHTML = html;
        card.onclick = () => handlePlotClick(plot.id);
        grid.appendChild(card);
    });
}

// ==================== SELETOR DE CULTURAS ====================
function renderCropSelector() {
    const container = document.getElementById('crop-selector');
    container.innerHTML = '';
    
    crops.forEach(crop => {
        const card = document.createElement('div');
        card.className = `crop-card flex gap-4 p-4 rounded-2xl border cursor-pointer ${selectedCrop === crop.id ? 'selected border-emerald-500' : 'border-slate-600 hover:border-slate-400 bg-slate-800'}`;
        
        card.innerHTML = `
            <div class="text-4xl flex-shrink-0 pt-0.5">${crop.emoji}</div>
            <div class="flex-1 min-w-0">
                <div class="font-semibold">${crop.name}</div>
                <div class="text-xs text-slate-400 line-clamp-2 mt-0.5">${crop.description}</div>
                
                <div class="flex flex-wrap gap-1.5 mt-3">
                    <div class="text-xs px-2.5 py-px bg-slate-700 rounded-lg flex items-center gap-1">
                        <i class="fa-solid fa-bolt text-sky-400 text-[10px]"></i> 
                        <span>${crop.cost.energy}</span>
                    </div>
                    <div class="text-xs px-2.5 py-px bg-slate-700 rounded-lg flex items-center gap-1">
                        <i class="fa-solid fa-tint text-cyan-400 text-[10px]"></i> 
                        <span>${crop.cost.water}</span>
                    </div>
                    <div class="text-xs px-2.5 py-px bg-emerald-900 text-emerald-400 rounded-lg flex items-center gap-1">
                        <span>+${crop.yield.credits} ¢</span>
                    </div>
                </div>
            </div>
        `;
        
        card.onclick = () => {
            if (selectedCrop === crop.id) {
                selectedCrop = null;
            } else {
                selectedCrop = crop.id;
            }
            renderCropSelector();
        };
        
        container.appendChild(card);
    });
}

// ==================== CLIQUE NA PARCELA ====================
function handlePlotClick(plotId) {
    const plot = plots.find(p => p.id === plotId);
    if (!plot) return;
    
    if (plot.isReady || plot.progress >= 100) {
        harvest(plotId);
        return;
    }
    
    if (plot.cropId) {
        if (confirm('Deseja remover esta cultura?')) {
            plot.cropId = null;
            plot.progress = 0;
            plot.isReady = false;
            renderFarm();
        }
        return;
    }
    
    if (!selectedCrop) {
        showToast("Selecione uma cultura primeiro!", "Clique em uma das culturas no painel lateral.", "⚠️");
        return;
    }
    
    const crop = crops.find(c => c.id === selectedCrop);
    
    if (resources.energy < crop.cost.energy || resources.water < crop.cost.water) {
        showToast("Recursos insuficientes!", "Você não tem energia ou água suficiente.", "⚠️");
        return;
    }
    
    resources.energy -= crop.cost.energy;
    resources.water -= crop.cost.water;
    
    plot.cropId = selectedCrop;
    plot.progress = 0;
    plot.isReady = false;
    plot.plantedDay = day;
    
    updateResourcesUI();
    renderFarm();
    
    selectedCrop = null;
    renderCropSelector();
}

// ==================== AVANÇAR DIA ====================
function advanceDay() {
    day++;
    document.getElementById('day-counter').textContent = day;
    
    let totalEnergyCost = 0;
    let totalWaterCost = 0;
    
    plots.forEach(plot => {
        if (plot.cropId) {
            const crop = crops.find(c => c.id === plot.cropId);
            
            plot.progress += crop.growthPerDay;
            
            if (plot.progress >= 100) {
                plot.progress = 100;
                plot.isReady = true;
            }
            
            totalEnergyCost += Math.floor(crop.cost.energy * 0.35);
            totalWaterCost += Math.floor(crop.cost.water * 0.4);
        }
    });
    
    resources.energy = Math.max(0, resources.energy - totalEnergyCost);
    resources.water = Math.max(0, resources.water - totalWaterCost);
    
    if (livestock > 0) {
        const production = Math.floor(livestock * 12);
        resources.credits += production;
        resources.sustainability = Math.min(100, resources.sustainability + Math.floor(livestock * 0.6));
    }
    
    updateResourcesUI();
    renderFarm();
    
    if (Math.random() < 0.15) {
        triggerRandomEvent();
    }
    
    checkWinCondition();
}

// ==================== COLHER ====================
function harvest(plotId) {
    const plot = plots.find(p => p.id === plotId);
    if (!plot || (!plot.isReady && plot.progress < 100)) return;
    
    const crop = crops.find(c => c.id === plot.cropId);
    if (!crop) return;
    
    resources.credits += crop.yield.credits;
    if (crop.yield.energy) resources.energy += crop.yield.energy;
    resources.sustainability = Math.min(100, resources.sustainability + crop.yield.sustain);
    
    plot.cropId = null;
    plot.progress = 0;
    plot.isReady = false;
    
    updateResourcesUI();
    renderFarm();
    checkWinCondition();
}

function harvestAll() {
    let harvested = 0;
    plots.forEach(plot => {
        if (plot.isReady || plot.progress >= 100) {
            const crop = crops.find(c => c.id === plot.cropId);
            if (crop) {
                resources.credits += crop.yield.credits;
                if (crop.yield.energy) resources.energy += crop.yield.energy;
                resources.sustainability = Math.min(100, resources.sustainability + crop.yield.sustain);
                harvested++;
            }
            plot.cropId = null;
            plot.progress = 0;
            plot.isReady = false;
        }
    });
    
    if (harvested > 0) {
        updateResourcesUI();
        renderFarm();
        showToast("Colheita em massa realizada!", `${harvested} parcelas foram colhidas.`, "🌾");
        checkWinCondition();
    } else {
        showToast("Nada para colher", "Nenhuma parcela está pronta.", "ℹ️");
    }
}

// ==================== EVENTOS ALEATÓRIOS ====================
function triggerRandomEvent() {
    const events = [
        {
            title: "🌡️ Onda de Calor",
            desc: "Crescimento acelerado, mas maior consumo de água!",
            effect: () => {
                plots.forEach(p => { if (p.cropId) p.progress += 18; });
                resources.water = Math.max(0, resources.water - 55);
            }
        },
        {
            title: "⚡ Tempestade Solar",
            desc: "Perda de energia nos sistemas!",
            effect: () => {
                resources.energy = Math.max(0, resources.energy - 95);
            }
        },
        {
            title: "🚁 Drones de Manutenção",
            desc: "Os drones aumentaram a eficiência!",
            effect: () => {
                plots.forEach(p => { if (p.cropId) p.progress += 12; });
                resources.sustainability = Math.min(100, resources.sustainability + 6);
            }
        },
        {
            title: "🦠 Praga Avançada",
            desc: "Algumas culturas foram afetadas.",
            effect: () => {
                const affected = plots.filter(p => p.cropId && Math.random() > 0.6);
                affected.forEach(p => {
                    p.progress = Math.max(0, p.progress - 45);
                    p.isReady = false;
                });
            }
        }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    event.effect();
    
    showToast(event.title, event.desc, "⚡");
    renderFarm();
    updateResourcesUI();
}

// ==================== COMPRAR PECUÁRIA ====================
function buyLivestock() {
    if (resources.credits < 800) {
        showToast("Créditos insuficientes!", "Você precisa de 800 créditos.", "⚠️");
        return;
    }
    
    resources.credits -= 800;
    livestock += 2;
    
    updateResourcesUI();
    updateLivestockUI();
    
    showToast("Vacas robóticas adquiridas!", "+2 unidades de pecuária inteligente.", "🐄");
}

function updateLivestockUI() {
    document.getElementById('livestock-count').textContent = livestock;
}

// ==================== ATUALIZAR RECURSOS ====================
function updateResourcesUI() {
    document.getElementById('credits-value').textContent = resources.credits.toLocaleString();
    
    document.getElementById('energy-value').textContent = resources.energy;
    const energyPercent = Math.min(100, Math.floor((resources.energy / 500) * 100));
    document.getElementById('energy-bar').style.width = energyPercent + '%';
    
    document.getElementById('water-value').textContent = resources.water;
    const waterPercent = Math.min(100, Math.floor((resources.water / 500) * 100));
    document.getElementById('water-bar').style.width = waterPercent + '%';
    
    document.getElementById('sustainability-value').textContent = resources.sustainability + '%';
    document.getElementById('sustainability-bar').style.width = resources.sustainability + '%';
    
    const sustainBar = document.getElementById('sustainability-bar');
    if (resources.sustainability < 40) {
        sustainBar.style.background = 'linear-gradient(to right, #ef4444, #f97316)';
    } else if (resources.sustainability < 65) {
        sustainBar.style.background = 'linear-gradient(to right, #eab308, #22c55e)';
    } else {
        sustainBar.style.background = 'linear-gradient(to right, #10b981, #14b8a6)';
    }
}

// ==================== VERIFICAR VITÓRIA ====================
function checkWinCondition() {
    if (resources.credits >= 5000 && resources.sustainability >= 90) {
        setTimeout(() => {
            const winModal = document.createElement('div');
            winModal.className = `fixed inset-0 bg-black/70 flex items-center justify-center z-[100]`;
            winModal.innerHTML = `
                <div class="bg-slate-900 border border-emerald-500 rounded-3xl p-10 max-w-md text-center">
                    <div class="text-7xl mb-6">🏆</div>
                    <h2 class="text-4xl font-display font-bold tracking-tighter mb-2">Parabéns!</h2>
                    <p class="text-emerald-400 text-xl mb-6">Você construiu a Fazenda do Futuro sustentável!</p>
                    
                    <div class="bg-slate-800 rounded-2xl p-5 text-left text-sm mb-8">
                        <div class="flex justify-between mb-2"><span>Créditos finais:</span> <span class="font-mono font-bold">${resources.credits}</span></div>
                        <div class="flex justify-between"><span>Sustentabilidade:</span> <span class="font-mono font-bold">${resources.sustainability}%</span></div>
                    </div>
                    
                    <button onclick="resetSimulation(); this.closest('.fixed').remove()" 
                            class="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold text-lg transition-all">
                        JOGAR NOVAMENTE
                    </button>
                </div>
            `;
            document.body.appendChild(winModal);
        }, 600);
    }
}

// ==================== TOAST ====================
function showToast(title, description, icon = "ℹ️") {
    const toast = document.getElementById('toast');
    document.getElementById('toast-icon').innerHTML = icon;
    document.getElementById('toast-title').innerHTML = title;
    document.getElementById('toast-desc').innerHTML = description;
    
    toast.classList.remove('hidden');
    toast.classList.add('flex');
    
    setTimeout(() => {
        toast.classList.remove('flex');
        toast.classList.add('hidden');
    }, 4200);
}

// ==================== REINICIAR SIMULAÇÃO ====================
function resetSimulation() {
    if (!confirm('Tem certeza que deseja reiniciar a simulação?')) return;
    
    resources = { credits: 1250, energy: 420, water: 380, sustainability: 68 };
    day = 1;
    livestock = 4;
    selectedCrop = null;
    
    plots.forEach(plot => {
        plot.cropId = null;
        plot.progress = 0;
        plot.isReady = false;
    });
    
    document.getElementById('day-counter').textContent = day;
    updateResourcesUI();
    updateLivestockUI();
    renderFarm();
    renderCropSelector();
    
    showToast("Simulação reiniciada!", "Boa sorte na nova tentativa!", "🔄");
}

// ==================== INICIAR ====================
document.addEventListener('DOMContentLoaded', init);