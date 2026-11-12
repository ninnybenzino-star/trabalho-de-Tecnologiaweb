// --- ESTADO DA APLICAÇÃO E PERSISTÊNCIA ---
// Tenta carregar os dados guardados no localStorage do browser. Caso não existam, usa a lista inicial padrão.
let items = JSON.parse(localStorage.getItem('uniscedWebItems')) || [
    { id: 1, name: 'Licenciatura em Engenharia Informática', category: 'Faculdade de Tecnologias', price: 4500, date: '2026-01-15' },
    { id: 2, name: 'Licenciatura em Contabilidade e Auditoria', category: 'Faculdade de Ciências Económicas', price: 4000, date: '2026-02-10' },
    { id: 3, name: 'Licenciatura em Direito', category: 'Faculdade de Ciências Sociais', price: 4200, date: '2026-01-20' },
    { id: 4, name: 'Mestrado em Gestão de Educação', category: 'Pós-Graduação', price: 7500, date: '2026-03-01' },
    { id: 5, name: 'Serviço de Emissão de Declarações e Histórico', category: 'Secretaria Académica', price: 350, date: '2026-03-05' }
];

// Captura de elementos do DOM (Document Object Model) para manipulação via JavaScript
const itemsGrid = document.getElementById('itemsGrid');
const itemForm = document.getElementById('itemForm');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

// Função auxiliar para salvar o estado atual no localStorage do navegador
function saveToLocalStorage() {
    localStorage.setItem('uniscedWebItems', JSON.stringify(items));
}

// --- FUNÇÃO DE RENDERIZAÇÃO (Atualiza o ecrã com base nos dados) ---
function renderItems(dataArray) {
    itemsGrid.innerHTML = ''; // Limpa a grelha antes de desenhar novamente
    
    // Validação se a lista estiver vazia após busca
    if (dataArray.length === 0) {
        itemsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">Nenhum curso ou serviço encontrado com esses critérios.</p>';
        return;
    }

    // Criação dinâmica de elementos HTML para cada item do array
    dataArray.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div>
                <span class="badge">${item.category}</span>
                <h4>${item.name}</h4>
                <div class="price">${item.price.toLocaleString('pt-MZ')} MT <span style="font-size: 0.8rem; color: #64748b; font-weight: normal;">/ Mensalidade ou Taxa</span></div>
                <p style="font-size: 0.85rem; color: #64748b;">Registo inserido em: ${item.date}</p>
            </div>
            <button class="btn-delete" onclick="deleteItem(${item.id})" style="margin-top: 15px;">Remover Registo</button>
        `;
        itemsGrid.appendChild(card);
    });
}

// --- ADICIONAR NOVO ITEM VIA FORMULÁRIO ---
itemForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que a página recarregue ao submeter o formulário
    
    // Recolha dos valores preenchidos nos inputs
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('itemCategory').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const currentDate = new Date().toISOString().split('T')[0]; // Data atual formato AAAA-MM-DD

    // Criação do novo objeto de registo
    const newItem = {
        id: Date.now(), // Usa o timestamp atual como ID único numérico
        name,
        category,
        price,
        date: currentDate
    };

    items.push(newItem);       // Adiciona ao array principal
    saveToLocalStorage();      // Guarda no armazenamento local
    processAndRender();        // Atualiza a visualização no ecrã
    itemForm.reset();          // Limpa os campos do formulário
});

// --- REMOVER ITEM ---
window.deleteItem = function(id) {
    items = items.filter(item => item.id !== id); // Filtra mantendo apenas os itens cujo ID é diferente
    saveToLocalStorage();
    processAndRender();
};

// --- ALGORITMO DE BUSCA E ORDENAÇÃO EFICIENTE ---
function processAndRender() {
    const searchTerm = searchInput.value.toLowerCase();
    const sortValue = sortSelect.value;

    // 1. Filtragem por nome ou categoria em tempo real
    let filtered = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.category.toLowerCase().includes(searchTerm)
    );

    // 2. Ordenação condicional baseada na escolha do utilizador
    if (sortValue === 'name-asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name)); // Ordem alfabética
    } else if (sortValue === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);             // Menor para maior preço
    } else if (sortValue === 'date-desc') {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date)); // Mais recentes primeiro
    }

    renderItems(filtered); // Renderiza a lista filtrada e ordenada
}

// --- EVENT LISTENERS (Ouvintes de eventos para reatividade) ---
searchInput.addEventListener('input', processAndRender);
sortSelect.addEventListener('change', processAndRender);

// Execução inicial ao abrir a página
processAndRender();