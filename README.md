# 🛍️ Bewear - E-commerce de Moda

**Bewear** é um e-commerce moderno e completo de roupas e acessórios, desenvolvido com as mais recentes tecnologias web. O projeto oferece uma experiência de compra completa, desde a navegação por produtos até a finalização do pedido com pagamento integrado.

## 🚀 Funcionalidades

### 🔐 **Autenticação e Usuários**

- Sistema de login e cadastro de usuários
- Autenticação via email/senha
- Autenticação social com Google
- Sessões seguras com BetterAuth
- Proteção de rotas autenticadas

### 🛒 **Carrinho de Compras**

- Adicionar/remover produtos do carrinho
- Ajustar quantidades de produtos
- Carrinho temporário para compra rápida ("Comprar Agora")
- Carrinho persistente para usuários logados
- Sincronização entre diferentes sessões

### 📦 **Catálogo de Produtos**

- Navegação por categorias (Acessórios, Bermudas & Shorts, Calças, Camisetas, Jaquetas & Moletons, Tênis)
- Sistema de filtros avançados:
  - Filtro por cor
  - Filtro por tamanho
  - Busca por nome do produto
  - Ordenação por preço e relevância
- Páginas detalhadas de produtos com variantes
- Seletor de tamanhos e cores
- Imagens em alta qualidade

### 🏠 **Endereços de Entrega**

- Cadastro múltiplo de endereços
- Preenchimento automático via CEP (integração ViaCEP)
- Validação de formulários com máscaras
- Seleção de endereço para entrega
- Edição e exclusão de endereços

### 💳 **Pagamento e Checkout**

- Integração completa com Stripe
- Processamento seguro de pagamentos
- Checkout em etapas (Identificação → Confirmação → Pagamento)
- Cálculo automático de frete
- Códigos de rastreamento

### 📋 **Gestão de Pedidos**

- Histórico completo de pedidos
- Status detalhado do pedido:
  - Pendente
  - Pago
  - Em separação
  - Saiu para entrega
  - Entregue
  - Cancelado
- Detalhamento de itens do pedido
- Estado vazio amigável quando não há pedidos

### 📱 **Design Responsivo**

- Interface moderna e intuitiva
- Totalmente responsivo (mobile-first)
- Componentes reutilizáveis com shadcn/ui
- Tema dark/light mode
- Animações suaves e feedback visual

## 🛠️ Tecnologias Utilizadas

### **Frontend**

- **Next.js** `15.4.1` - Framework React com App Router
- **React** `19.1.0` - Biblioteca principal
- **TypeScript** `^5` - Tipagem estática
- **Tailwind CSS** `^4` - Framework CSS utilitário
- **shadcn/ui** - Biblioteca de componentes

### **Backend & Database**

- **PostgreSQL** - Banco de dados principal
- **Drizzle ORM** `^0.44.2` - ORM TypeScript-first
- **Drizzle Kit** `^0.31.4` - Ferramentas de migração

### **Autenticação**

- **BetterAuth** `^1.2.12` - Sistema de autenticação moderno
- **Google OAuth** - Login social

### **Pagamentos**

- **Stripe** `^18.4.0` - Processamento de pagamentos
- **@stripe/stripe-js** `^7.8.0` - SDK JavaScript

### **Formulários e Validação**

- **React Hook Form** `^7.62.0` - Gerenciamento de formulários
- **Zod** `^4.0.15` - Validação de esquemas
- **@hookform/resolvers** `^5.2.1` - Integração RHF + Zod
- **react-number-format** `^5.4.4` - Máscaras de input

### **Estado e Queries**

- **TanStack React Query** `^5.83.0` - Gerenciamento de estado servidor

### **UI e Experiência**

- **Radix UI** - Componentes primitivos acessíveis
- **Lucide React** `^0.536.0` - Ícones
- **Sonner** `^2.0.7` - Notificações toast
- **next-themes** `^0.4.6` - Suporte a temas

### **Utilitários**

- **clsx** `^2.1.1` + **tailwind-merge** `^3.3.1` - Manipulação de classes CSS
- **class-variance-authority** `^0.7.1` - Variantes de componentes

### **Desenvolvimento**

- **ESLint** `^9` - Linting de código
- **Prettier** `^3.6.2` - Formatação de código
- **TypeScript** `^5` - Tipagem estática

## 🏗️ Arquitetura do Projeto

```
src/
├── actions/          # Server Actions do Next.js
├── app/             # App Router (páginas e layouts)
├── components/      # Componentes reutilizáveis
│   ├── common/      # Componentes específicos do negócio
│   └── ui/          # Componentes de interface (shadcn/ui)
├── db/              # Configuração e schema do banco
├── helpers/         # Funções utilitárias
├── hooks/           # Hooks customizados
│   ├── mutations/   # Hooks de mutação (React Query)
│   └── queries/     # Hooks de consulta (React Query)
├── lib/             # Configurações e utilitários
├── providers/       # Providers do React
└── types/           # Definições de tipos TypeScript
```

## 🗄️ Schema do Banco de Dados

O projeto utiliza as seguintes entidades principais:

- **Users** - Usuários do sistema
- **Sessions** - Sessões de autenticação
- **Categories** - Categorias de produtos
- **Products** - Produtos base
- **ProductVariants** - Variações de produtos (cores, tamanhos)
- **Carts** - Carrinhos de compra
- **CartItems** - Itens do carrinho
- **ShippingAddresses** - Endereços de entrega
- **Orders** - Pedidos finalizados
- **OrderItems** - Itens dos pedidos

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Conta no Stripe (para pagamentos)
- Conta no Google Cloud (para OAuth)

### Configuração

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/bewear.git
cd bewear
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env.local
```

Configure as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://..."

# BetterAuth
BETTER_AUTH_SECRET="seu-secret-aqui"

# Google OAuth
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Public Url
NEXT_PUBLIC_APP_URL="http://localhost:3000"

#Melhor Envio
MELHOR_ENVIO_TOKEN="seu-token-melhor-envio"
```

4. **Execute as migrações do banco**

```bash
npm run db:generate
npm run db:migrate
```

5. **Popule o banco com dados iniciais**

```bash
npm run db:seed
```

6. **Execute o projeto**

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 📝 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Executa build de produção
- `npm run lint` - Executa linting do código

## 🎨 Características de Design

- **Design System** baseado em shadcn/ui
- **Tipografia** moderna e legível
- **Cores** harmoniosas com foco em roxo/azul
- **Animações** suaves e performáticas
- **Acessibilidade** seguindo padrões WCAG
- **Mobile-first** para todas as telas

## 🔧 Padrões de Desenvolvimento

- **Clean Code** - Código limpo e legível
- **SOLID** - Princípios de design de software
- **DRY** - Don't Repeat Yourself
- **Componentização** - Componentes reutilizáveis
- **TypeScript** - Tipagem forte em todo o código
- **Server Actions** - Ações do servidor type-safe

## 📈 Performance

- **App Router** do Next.js 15 para otimização automática
- **React Query** para cache inteligente de dados
- **Imagens otimizadas** com Next.js Image
- **Bundle splitting** automático
- **Tree shaking** para redução do bundle

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request


## 👨‍💻 Desenvolvedor

Desenvolvido por Lucas Grangeiro.

---

**Bewear** - Vista-se com estilo e qualidade únicos! 👕✨
