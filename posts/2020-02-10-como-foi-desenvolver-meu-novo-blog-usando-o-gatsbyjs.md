---
title: Como foi desenvolver meu novo blog usando o GatsbyJS
description: "Nesse artigo vou passar por todas as tecnologias que usei aqui: GraphQL, Styled Components, Algolia, Netlify CMS e mais um monte de coisa \U0001F61C"
date: '2020-02-10 02:19:24'
image: assets/img/gatsby.jpg
category: dev
background: '#B31917'
---
<!--StartFragment-->

Dito isso, estamos em 2019. Por bastante tempo [concentrei meus artigos no Medium](https://medium.com/@felipefialho). Porém nos últimos meses não estava satisfeito com [algumas mudanças que aconteceram](https://willianjusten.com.br/diga-nao-ao-medium-tenha-sua-propria-plataforma/) por lá.

E como sempre, surgiram milhares de novas tecnologias, então achei que era o momento de estudar desenvolvendo uma nova versão para esse projeto, e de quebra usando algumas tecnologias bem *hypes*, como:

* [Gatsby](https://www.gatsbyjs.org/)
* [Gatsby Image](https://www.gatsbyjs.org/packages/gatsby-image/)
* [GraphQL](https://graphql.org/)
* [Styled Components](https://www.styled-components.com/)
* [styled-media-query](https://github.com/morajabi/styled-media-query)
* [Styled Icons](https://styled-icons.js.org/)
* [Algolia](https://www.algolia.com/products/instantsearch/)
* [Netlify CMS](https://www.netlifycms.org/)
* [Netlify](https://www.netlify.com/)

<!--EndFragment-->
blob:http://localhost:8000/781a64f5-7012-4250-b49a-1cb4bc354cc0
<!--StartFragment-->

Gatsby é um SSG (Static Site Generator), mas tem como diferencial ser totalmente baseado em React e utilizar o poder do GraphQL para consumir conteúdos e assets.

Ou seja, Gatsby é um framework poderoso. Uma das suas principais vantagens é gerar arquivos estáticos (olá SEO) no build, enquanto usamos React em tempo de desenvolvimento.

Além disso, o Gatsby [possuí milhares de plugins](https://www.gatsbyjs.org/plugins/). Eles elevam a DevXP (Dev Experience) para outro patamar, porque fornecem soluções performáticas para várias questões do dia-a-dia, fazendo com que a pessoa que está desenvolvendo perca menos tempo com trivialidades e tenha mais tempo para focar coisas essenciais para o produto.

Por gerar arquivos estáticos e ter sistemas de cache, a performance é simplesmente espetacular.

Por cima acredito que o Gatsby só se torna desinteressante em projetos com grande volume de conteúdo dinâmico, nesse caso o [NextJS](https://nextjs.org/) pode funcionar melhor, por utilizar SSR (Server Side Render).

Ah, a documentação é simplesmente sensacional e dificilmente você precisará fazer consultas fora do próprio site do Gatsby.

## Gatsby Image

Está entre as coisas mais legais que vi nos últimos tempos.

Basicamente é um componente React que serve para interligar as consultas GraphQL com o próprio [processamento de imagens do Gatsby](https://image-processing.gatsbyjs.org/), e o resultado é sensacional.

<!--EndFragment-->
