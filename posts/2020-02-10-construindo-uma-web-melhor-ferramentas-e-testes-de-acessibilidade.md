---
title: 'Construindo uma web melhor: ferramentas e testes de acessibilidade'
description: >-
  “acessibilidade: possibilidade e condição de alcance para utilização, com
  segurança e autonomia, de […] informação e comunicação, inclusive seus
  sistemas e tecnologias, […] por pessoa com deficiência ou com mobilidade
  reduzida;” (Lei Brasileira de Inclusão)
date: '2020-02-10 08:02:03'
image: assets/img/DreamHost-Accessibility-Tips-750x498.jpg
category: html
background: '#B31917'
---
![](assets/img/DreamHost-Accessibility-Tips-750x498.jpg)

<!--StartFragment-->

“acessibilidade: possibilidade e condição de alcance para utilização, com segurança e autonomia, de \[…] informação e comunicação, inclusive seus sistemas e tecnologias, \[…] por pessoa com deficiência ou com mobilidade reduzida;” *(Lei Brasileira de Inclusão)*

<!--EndFragment-->

<!--StartFragment-->

A [Lei Brasileira de Inclusão](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm) foi sancionada em 2015 e dispõe de um capítulo inteiro dedicado ao acesso à informação e comunicação ditando a obrigatoriedade de que sites de empresas brasileiras e do governo sejam acessíveis, no entanto, a falta de uma especificação, abre espaço para que a lei não seja cumprida.

<!--EndFragment-->

<!--StartFragment-->

De acordo com um [relatório de 2011 da OMS](http://www.who.int/disabilities/world_report/2011/report/en/), cerca de 15% da população mundial — percentual em referência ao número de habitantes no planeta em 2010, (ou mais de 1bi de pessoas) possui algum tipo de inaptidão permanente.

<!--EndFragment-->

<!--StartFragment-->

Os tipos de inaptidão são divididos em quatro: visual, auditiva, motora e cognitiva.

## Visual

* Temporária: pupilas dilatadas após uma consulta ao oftalmo;
* Permanente: daltonismo;

## Auditiva

* Temporária: assistir um vídeo em um ambiente com barulho;
* Permanente: perda auditiva completa;

## Motora

* Temporária: carregando compras;
* Permanente: tetraplegia;

## Cognitiva

* Temporária: concussão;
* Permanente: dislexia;

Todas essas inaptidões apresentam diferentes níveis e podem ser temporárias e/ou permanentes.

<!--EndFragment-->

<!--StartFragment-->

A WCAG (*Web Content Accessibility Guidelines*) é um conjunto de regras que têm como objetivo garantir que o conteúdo na web seja acessível a todos os usuários. Ela se divide em quatro princípios:

1. **Perceptível:**As informações e os componentes da interface do usuário devem ser apresentados em formas que possam ser percebidas pelo usuário.
2. **Operável:**Os componentes de interface de usuário e a navegação devem ser operáveis, por exemplo: todas as funcionalidades da página estão disponíveis via teclado.
3. **Compreensível:** A informação e a operação da interface de usuário devem ser compreensíveis, por exemplo: a página possui indicador da linguagem no cabeçalho.
4. **Robusto:** O conteúdo deve ser robusto o suficiente para poder ser interpretado de forma confiável por uma ampla variedade de agentes de usuário, incluindo tecnologias assistivas.

<!--EndFragment-->

<!--StartFragment-->

O [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) (*Accessible Rich Internet Applications*) oferece um conjunto de funcionalidades que têm como objetivo tornar aplicações da web mais acessíveis e se divide em três principais categorias:

## Roles

Determinam o que faz um elemento. Por exemplo, um elemento com `role="search"`, define que aquele item dá acesso a busca dentro do aplicativo;

## Propriedades

Definem características intrínsecas a um elemento. Por exemplo, quando objetos não têm nome explícito, podemos usar aria-label para oferecer essa *affordance*;

## Estados

Propriedades especiais que definem a condição atual de um elemento. Por exemplo, podemos usar `aria-checked` para anunciar o estado de um elemento que se comporta com uma checkbox;

<!--EndFragment-->

<!--StartFragment-->

De acordo com uma pesquisa do GDS (*Govern Digital Service* do Reino Unido), apenas 30% dos problemas de a11y são encontrados usando testes automatizados. O estudo pode ser lido [aqui](https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/).

Então porquê escrever testes automatizados? Apesar de não serem perfeitos, os testes nos ajudam a nos concentrar nos outros 70% de problemas que são achados manualmente.

<!--EndFragment-->

<!--StartFragment-->

Se você trabalha num time ágil, seu processo é composto de tarefas organizadas por um gerente de projeto, interfaces e especificações entregues por designers, aplicação feita pelos desenvolvedores e review feito pelo QA, que ás vezes também é desenvolvedor, quem nunca? A seguir, alguns itens para ajudar todo o time durante os processos de criação do produto.

<!--EndFragment-->

<!--StartFragment-->

Se você é gerente de projeto, teu papel mais importante sobre acessibilidade é ser um *advocate*do tópico, alguns dos itens importantes para considerar são:

* **Inclua acessibilidade em todos os sprints:**assim como outros tópicos normalmente esquecidos durante o planejamento de sprints, como testes, o esforço para criar conteúdo acessível deve ser mensurado;
* **Se familiarize com os processos necessários para criar conteúdo acessível:**para que as estimativas sejam corretas, é necessário que haja conhecimento sobre os processos;
* **Incentive todo o time a adquirir conhecimento sobre o tópico: t**er apenas uma pessoa no time responsável pela acessibilidade não funciona muito bem, provavelmente o seu time não tem apenas uma pessoa responsável por escrever JS, não deveria ser diferente com acessibilidade;

<!--EndFragment-->

<!--StartFragment-->

Designers, tanto de interface quando de experiência, devem se preocupar com alguns dos itens a seguir:

* **Conteúdo tem contraste satisfatório:**contraste entre um pedaço de texto e o background deve ser de no mínimo 4.5 para 1, existe um plugin do Sketch que faz essa análise automaticamente. Uma explicação completa sobre esses valores pode ser encontrada [aqui](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html);
* **Existem várias maneiras de interagir com a interface: c**onsidere que as pessoas podem interagir usando mouse, teclado ou diferentes dispositivos. Caso não seja possível tornar algo acessível, crie uma rota alternativa com o conteúdo simplificado;
* **Todos os controles possuem *labels* acessíveis:***labels* devem prover explicações sucintas sobre as ações dos controles e nunca desaparecer completamente;

<!--EndFragment-->

<!--StartFragment-->

Aos desenvolvedores, creio que grande maioria dos participantes do evento e leitores desse post, itens importantes para levar em consideração durante o processo de desenvolvimento:

* **Utilize elementos HTML corretos para o tipo de conteúdo criado:**use a tag `button` em vez de uma `div`, a tag `nav` ao fazer uma navegação, conteúdo não diretamente relacionado ao conteúdo da página deve utilizar `aside`, todos esses elementos são interpretados de maneira confiável pelos *browsers*, dando mais segurança no comportamento do seu produto, em outras palavras: *don’t fight the platform*;
* **Esconda elementos decorativos de leitores de tela:**imagens que não fornecem informações importantes podem ser utilizadas como backgrounds, ícones decorativos podem ser escondidos usando `aria-hidden="true"`, etc;
* **Use atributos ARIA quando necessário:**para aumentar a robustez do seu aplicativo, faça uso desses atributos quando necessário, por exemplo um *checkbox*customizado pode se valer de `aria-checked` para comunicar a uma tecnologia assistiva o estado do *checkbox*;

<!--EndFragment-->

<!--StartFragment-->

Como QA, alguns dos tópicos importantes a serem testados ao fazer uma revisão são:

* **Tabs seguem uma ordem lógica:** seus usuários devem conseguir navegar pela aplicação usando o teclado de maneira fluída, conseguindo acessar todos os menus, tendo um *shortcut*para o conteúdo principal da página, etc;
* **O conteúdo possui uma hierarquia lógica:**cabeçalhos existem para indicar grupos de conteúdo, itens clicáveis são facilmente identificáveis, não existe nenhuma óbvia indicação de problemas ao visualizar um conteúdo;
* **Conteúdos não-textuais contêm descrições alternativas apropriadas:**quando apropriado, imagens e outros elementos visuais possuem alternativas em texto, beneficiando um grande leque de usuários, dos que se utilizam de leitores de tela aos que não têm acesso a internet de alta velocidade;

<!--EndFragment-->

<!--StartFragment-->

Apesar de que as obrigações legais e as checklists sejam uma maneira de certa forma fácil de vender acessibilidade, não devemos encará-la como uma obrigação e sim ter uma perspectiva humana e empática sobre os desafios a serem encarados para tornar seu projeto acessível.

<!--EndFragment-->
