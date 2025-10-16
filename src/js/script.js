class Funcionario {
    constructor(nome, idade, cargo, salario) {
        this._id = Date.now();
        this._nome = nome;
        this._idade = idade;
        this._cargo = cargo;
        this._salario = salario;
    }

    // Getters
    get id() { return this._id; }
    get nome() { return this._nome; }
    get idade() { return this._idade; }
    get cargo() { return this._cargo; }
    get salario() { return this._salario; }

    // Setters
    set nome(novoNome) { this._nome = novoNome; }
    set idade(novoIdade) { this._idade = novoIdade; }
    set cargo(novoCargo) { this._cargo = novoCargo; }
    set salario(novoSalario) { this._salario = novoSalario; }

    toString() {
        return `
            Nome: ${this._nome}
            Idade: ${this._idade}
            Cargo: ${this._cargo}
            Salário: ${this._salario.toFixed(2)}
        `;
    }
};

let funcionarios = [];
let isEditing = false;
let currentFuncionarioId = null;

// Ref para a DOM
const form = document.getElementById("employee-form");
const employeeList = document.getElementById("employee-list");
const reportOutput = document.getElementById("report-output");
const submitButton = document.getElementById("submit-button");
const employeeId = document.getElementById("employee-id");

// Renderizar funcionarios
const renderTable = () => {
    employeeList.innerHTML = "";
    funcionarios.forEach((func) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${func.nome}</td>
            <td>${func.idade}</td>
            <td>${func.cargo}</td>
            <td>${func.salario.toFixed(2)}</td>
            <td>
                <button class="edit-btn" data-id="${func.id}">Editar</button>
                <button class="delete-btn" data-id="${func.id}">Excluir</button>
            </td>
        `;
        employeeList.appendChild(row);
    });
};

// Funções anônimas e arrow
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const idade = parseInt(document.getElementById("idade").value);
    const cargo = document.getElementById("cargo").value;
    const salario = parseFloat(document.getElementById("salario").value);

    if (isEditing) {
        const funcionario = funcionarios.find((func) => func.id === currentFuncionarioId);
        
        if (funcionario) {
            funcionario.nome = nome;
            funcionario.idade = idade;
            funcionario.cargo = cargo;
            funcionario.salario = salario;
            alert('Funcionário atualizado com sucesso!');
        }
    }

    else {
        const funcionario = new Funcionario(nome, idade, cargo, salario);
        funcionarios.push(funcionario);
        alert('Funcionário cadastrado com sucesso!');
    }

    form.reset();
    isEditing = false;
    currentFuncionarioId = null;
    submitButton.textContent = 'Cadastrar';
    renderTable();
});

// Editar e Excluir func anonimas
employeeList.addEventListener("click", (event) => {
    const target = event.target;
    const id = parseInt(target.getAttribute("data-id"));

    // Excluir
    if (target.classList.contains("delete-btn")) {
        funcionarios = funcionarios.filter((func) => func.id !== id);
        alert('Funcionário excluído com sucesso!');
        renderTable();
    }

    // Editar
    if (target.classList.contains("edit-btn")) {
        const funcionario = funcionarios.find((func) => func.id === id);
        if (funcionario) {
            document.getElementById("nome").value = funcionario.nome;
            document.getElementById("idade").value = funcionario.idade;
            document.getElementById("cargo").value = funcionario.cargo;
            document.getElementById("salario").value = funcionario.salario;

            isEditing = true;
            currentFuncionarioId = funcionario.id;
            submitButton.textContent = 'Atualizar';
        }
    }
});

// Relatórios
document.getElementById("btn-salario-maior-5k").addEventListener("click", () => {
    const filteredFuncionarios = funcionarios.filter((func) => func.salario > 5000).map(func => `${func.nome} (R$ ${func.salario.toFixed(2)})`);
   reportOutput.innerHTML = `<strong>funcionarios com Salário > R$ 5000:</strong><br>${filteredFuncionarios.join('<br>') || 'Nenhum'}`;
});

document.getElementById("btn-media-salarial").addEventListener("click", () => {
    if (funcionarios.length === 0) {
        reportOutput.innerHTML = 'Não há funcionarios para calcular a média.';
        return;
    }

    const total = funcionarios.reduce((acc, func) => acc + func.salario, 0);
    const media = total / funcionarios.length;
    reportOutput.innerHTML = `<strong>Média Salarial:</strong><br>R$ ${media.toFixed(2)}`;
});

document.getElementById("btn-cargos-unicos").addEventListener("click", () => {
    const cargos = funcionarios.map(func => func.cargo);
    const cargosUnicos = [...new Set(cargos)];
    reportOutput.innerHTML = `<strong>Cargos Unicos:</strong><br>${cargosUnicos.join(', ') || 'Nenhum'}`;
});

document.getElementById("btn-nomes-maiusculo").addEventListener("click", () => {
    const nomesMaiusculo = funcionarios.map(func => func.nome.toUpperCase());
    reportOutput.innerHTML = `<strong>Nomes em Maiúsculo:</strong><br>${nomesMaiusculo.join(', ') || 'Nenhum'}`;
});

renderTable();