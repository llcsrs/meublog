---
title: Criando seu próprio framework PHP
description: >-
  /**  * Este é o primeiro de uma série de artigos traduzidos e adaptados  * a
  partir dos originais: "Create your own PHP Framework -  *
  http://symfony.com/doc/current/create_framework/index.html  * by Fabien
  Potencier.  */
date: '2020-02-27 01:09:52'
image: assets/img/php-900x506.jpg
category: dev
background: '#B31917'
---
![](assets/img/php-900x506.jpg)

<!--StartFragment-->

## Introdução

O framework [Symfony](https://symfony.com) é um conjunto de componentes PHP reutilizáveis, coesos e desacoplados que ajudam a resolver o problemas mais comuns do desenvolvimento web.

Você pode utilizar o framework web [Symfony](https://symfony.com/what-is-symfony) full-stack, o qual é construído sobre estes componentes… ou você pode criar seu próprio framework, utilizando estes mesmos componentes de baixo nível ou implementando tudo por conta própria. Esta série de tutoriais é sobre a segunda opção, implementar seu próprio web framework baseado nos componentes de baixo nível do Symfony.

## Por que você iria querer criar seu próprio framework?

Em primeiro lugar, por que você iria querer criar seu próprio framework? Se você pesquisar a respeito, todos vão dizer que reinventar a roda é algo ruim e que seria melhor escolher um framework já existente e esquecer completamente essa ideia de criar o seu próprio framework php. Na maioria das vezes eles estão certos, mas aqui estão algumas razões para criar o seu próprio framework:

* Para aprender mais sobre a arquitetura de baixo nível dos frameworks web modernos em geral e sobre os mecanismos internos do Symfony em particular.
* Para criar um framework especificamente adaptado às suas necessidades (*tenha certeza que suas necessidades são realmente bem específicas*).
* Para experimentar como é criar um framework, só por diversão (*aprender fazendo*).
* Para refatorar uma aplicação antiga que precise de uma boa dose das melhores práticas do desenvolvimento web.
* Para provar ao mundo de que você é capaz de criar seu próprio framework (*… mas com pouco esforço)*.

Esta série irá guiá-lo gentilmente através do processo de criação de um framework web, um passo de cada vez. E em cada etapa você terá um framework web funcional, podendo utilizá-lo como estiver ou aproveitando-o de base para o seu próprio framework. Começaremos com um framework bem simples, acrescentando mais recursos com o tempo. E então, eventualmente, você terá um framework web completo.

Além disso, cada etapa será uma oportunidade de aprender mais sobre alguns dos componentes do Symfony.

Muitos frameworks se auto intitulam como sendo frameworks MVC. Esse tutorial não é sobre o padrão MVC, já que os componentes do Symfony são capazes de criar qualquer tipo de framework e não somente aqueles que seguem a arquitetura MVC. Em todo caso, se você observar a semântica MVC, verá que esta série é sobre o *Controller*. Para os componentes *Model* e *View* você pode utilizar qualquer biblioteca de terceiros (Doctrine, Propel ou o simples e antigo PDO para o *Model*; PHP puro ou Twig para a *View*), é mais uma questão de gosto pessoal.

> Separation of Concerns — o único padrão de projeto que você realmente deveria se preocupar.

Durante a implementação de um framework, ter o padrão MVC como principal objetivo não é o mais correto. Seu principal objetivo deve ser a **Separação das Responsabilidades**(*Separation of Concerns*), provavelmente esse é o único padrão de projeto com o qual você realmente deve se preocupar. Os fundamentos dos componentes Symfony estão focados na especificação HTTP, tanto que o framework que você irá desenvolver poderia ser chamado de *framework HTTP* ou *framework Request*/*Response*.

## Antes de começar

Somente ler sobre como criar um framework não é suficiente. Você deve seguir esta série de artigos implementando todos os exemplos incluídos nestes tutoriais. Para isso você vai precisar de uma versão recente do PHP (5.5.9 or mais nova), um servidor web (Apache, Nginx ou o servidor embutido do PHP), um bom conhecimento de PHP e compreenção de programação Orientada a Objetos.

## Bootstrapping

Antes mesmo de começar a pensar na criação do framework você precisa pensar a respeito de algumas convenções: onde o código será armazenado, como as classes serão nomeadas, como referenciar dependências externas, etc.

Para armazenar o framework, crie um diretório em algum lugar da sua máquina:

<!--EndFragment-->

```
mkdir framework
cd framework
```

<!--StartFragment-->

## Gerenciamento de dependências

Vamos precisar do [Composer](https://getcomposer.org/) para instalar os componentes do Symfony que serão utilizados pelo seu framework. O composer é um gerenciador de dependências para projetos PHP. Se você ainda não tem ele instalado, faça o [download e a instalação](https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx) dele agora.

## Nosso projeto

Ao invés de criar o framework do zero, vamos escrever uma mesma aplicação repetidas vezes, adicionando camadas de abstração em cada etapa. Vamos começar com a mais simples aplicação PHP que podemos imaginar:

<!--EndFragment-->

```
<?php

// framework/index.php
$input = $_GET['name'];

printf('Hello %s', $input);
  
```

<!--StartFragment-->

Você pode utilizar o servidor embutido do PHP para testar esta magnífica aplicação através do seu browser:

<!--EndFragment-->

```
http://localhost:4321/index.php?name=Fabien

php -S 127.0.0.1:4321
```

<!--StartFragment-->

Ou então você pode utilizar um servidor web (Apache, Nginx, …).

No próximo artigo vamos introduzir o componente *HttpFoundation* e ver o que ele nos proporciona.

<!--EndFragment-->
