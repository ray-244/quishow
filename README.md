# QuiShow – Plataforma Web Interativa para o Ensino de Química

## Resumo

O **QuiShow** é uma plataforma web desenvolvida para tornar o ensino de Química mais simples, dinâmico e atrativo para estudantes do ensino fundamental e médio. A proposta surgiu diante das dificuldades comuns enfrentadas pelos alunos ao tentar compreender conceitos químicos, frequentemente vistos como abstratos e distantes da realidade. Para superar essas barreiras, o projeto integra conteúdos teóricos e práticas experimentais utilizando linguagem acessível e recursos audiovisuais de baixo custo.

Uma pesquisa realizada com alunos do Instituto Federal do Paraná (IFPR) mostrou que **66,7%** dos participantes consideram a plataforma muito útil e interessante, evidenciando sua relevância pedagógica. O desenvolvimento utilizou tecnologias modernas como **HTML**, **CSS**, **JavaScript**, **Node.js** e **Express**.

---

## 1. Introdução

O ensino de Química é frequentemente considerado difícil por muitos estudantes, principalmente pela natureza abstrata dos conteúdos. Quando apresentado de forma teórica e pouco interativa, o aprendizado se torna desmotivador e distante. 

Com esse cenário, o **QuiShow** surge como uma solução tecnológica voltada a facilitar a compreensão da Química, tornando o aprendizado mais interativo e acessível. O projeto combina teoria, prática experimental e recursos digitais, oferecendo também aos professores um material de apoio reutilizável e confiável.

---

## 2. Objetivo

O objetivo central do QuiShow é proporcionar uma aprendizagem mais eficiente e atrativa, por meio de:

* Conteúdos teóricos simplificados e bem estruturados;
* Apresentação de experimentos práticos;
* Interface responsiva e intuitiva;
* Recursos interativos que estimulam o engajamento;
* Material confiável, claro e reutilizável por professores e estudantes.

---

## 3. Fundamentação Teórica

O projeto fundamenta-se em estudos das seguintes áreas:

* **Metodologias Ativas**, que incentivam o protagonismo do aluno;
* **Didática da Química**, destacando a importância da experimentação aliada à teoria;
* **Tecnologias Digitais na Educação**, que ampliam as possibilidades de ensino e aprendizagem.

Esses elementos reforçam o papel das plataformas digitais como facilitadoras no processo de ensino, principalmente em disciplinas que exigem forte visualização conceitual.

---

## 4. Tecnologias Utilizadas

### 4.1 Front-end

* HTML5
* CSS3
* JavaScript

### 4.2 Back-end

* Node.js
* Express.js

### 4.3 Outras Ferramentas

* Git e GitHub
* Estudos pedagógicos e de química experimental

---

## 5. Metodologia de Desenvolvimento

O desenvolvimento do QuiShow foi organizado nas seguintes etapas:

1.  **Pesquisa teórica** sobre ensino de Química e tecnologias educacionais;
2.  **Planejamento da plataforma**, definindo requisitos e funcionalidades;
3.  **Criação da interface (front-end)** com foco em acessibilidade e responsividade;
4.  **Desenvolvimento do back-end**, incluindo servidor, rotas e lógica;
5.  **Testes de usabilidade e funcionalidade**;
6.  **Aplicação de pesquisa com alunos do IFPR**, avaliando a aceitação da plataforma.

O resultado obtido foi positivo, com **66,7%** de aprovação entre os estudantes.

---

## 6. Funcionalidades

* 📘 Conteúdos teóricos explicados de forma simples
* 🔬 Experimentos práticos com demonstrações
* 👤 Login e registro de usuários
* 👍 Sistema de curtidas e comentários
* 📱 Interface responsiva
* 🧑‍🏫 Espaço didático para alunos e professores

---

## 7. Estrutura do Projeto

```bash
quishow/
├── public/              # Arquivos estáticos (CSS, JS, imagens)
├── views/               # Páginas renderizadas
├── routes/              # Rotas da aplicação
├── controllers/         # Lógica das rotas
├── models/              # Modelos de dados (se houver banco)
├── app.js               # Configuração principal do servidor
├── package.json
└── README.md
```

## 8. Como Executar o Projeto

### Requisitos

* Node.js
* NPM ou Yarn

### Passos

**Clonar o repositório**

```bash
git clone [https://github.com/usuario/quishow.git](https://github.com/usuario/quishow.git)
cd quishow
```

**Instalar as dependências**

```bash
npm install
```

**Iniciar o servidor**

```bash
npm run dev
```

**Acessar no navegador**

```bash
http://localhost:4000
```

**Acessar o site**

[quishow.onrender.com](https://quishow.onrender.com)
