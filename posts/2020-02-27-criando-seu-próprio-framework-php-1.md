---
title: Criando seu próprio framework PHP
description: >-
  /**  * Este é o quarto de uma série de artigos traduzidos e adaptados  * a
  partir dos originais: "Create your own PHP Framework -  *
  http://symfony.com/doc/current/create_framework/index.html  * by Fabien
  Potencier.  */
date: '2020-02-27 12:06:06'
image: assets/img/php-900x506.jpg
category: dev
background: '#B31917'
---
![](assets/img/php-900x506.jpg)

<!--StartFragment-->

Antes de mergulharmos no componente de rotas, vamos refatorar nosso framework. Uma pequena alteração para deixar nossos templates ainda mais legíveis:

<!--EndFragment-->

```
<?php //framework/web/front.php

require_once __DIR__.'/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();

$map = array(
    '/hello' => 'hello',
    '/bye'   => 'bye',
);

$path = $request->getPathInfo();
if (isset($map[$path])) {
    ob_start();
    extract($request->query->all(), EXTR_SKIP);
    include sprintf(__DIR__.'/../src/pages/%s.php', $map[$path]);
    $response = new Response(ob_get_clean());
} else {
    $response = new Response('Not Found', 404);
}

$response->send();
```

<!--StartFragment-->

Com isso não precisaremos nos preocupar em extrair os dados do objeto `$request` em nossos templates.

<!--EndFragment-->

```
<!-- framework/src/pages/hello.php -->
Hello <?php echo htmlspecialchars(isset($name) ? $name : 'World', ENT_QUOTES, 'UTF-8') ?>
```

<!--StartFragment-->

Agora estamos preparados para as novas funcionalidades.

Um dos aspectos mais importantes do nosso site é o formato das suas URLs. Graças ao *URL map*, atualmente um simples *array*, nós somos capazes de desacoplar uma URL do seus respectivo código que gera a resposta HTTP associada a esta URL. Mas isso ainda não é suficiente.

E se quisermos suportar PATHs dinâmicos (ou URLs dinâmicas) permitindo-nos embutir dados diretamente na URL (`/hello/Fabien`) ao invés de recair em query strings (`/hello?name=Fabien`)?

Para suportar essa funcionalidade, adicione o componente `symfony/routing` como dependência:

<!--EndFragment-->

```
composer require symfony/routing
```

<!--StartFragment-->

Ao invés de utilizar um array para o *URL map*, o novo componente `routing` precisa de um objeto do tipo `RoutingCollection`:

<!--EndFragment-->

```
use Symfony\Component\Routing\Route;

$routes->add(
    'hello', new Route(
       '/hello/{name}', array('name' => 'World')
    )
);$routes->add('bye', new Route('/bye'));
```

<!--StartFragment-->

Cada entrada nessa coleção (*collection*) de rotas é formada por um nome `hello` e uma instância de `Route`, a qual é definida por um padrão `hello/{name}` e um array de valores default para os atributos da rota `array('name' => 'World')`.

Resumindo, o novo componente `routing` depende de uma coleção de rotas `RouteCollection` que por sua vez é composto de diversos objetos do tipo `Route`.

> ***Nota:***\
> Leia a [documentação do componente Routing](http://symfony.com/doc/current/components/routing.html) para aprender mais sobre suas funcionalidades, como geração de URL, requisitos de atributos, implementação dos métodos HTTP, loaders para arquivos YAML ou XML, dumpers para arquivos PHP ou Apache rewrite rules para melhorar a performance e muito mais.

Baseado nas informações armazenadas na instância do `RouteCollection`, uma instância de `UrlMatcher` pode casar os paths de uma URL:

<!--EndFragment-->

```
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\Matcher\UrlMatcher;

$context = new RequestContext();
$context->fromRequest($request);
$matcher = new UrlMatcher($routes, $context);

$attributes = $matcher->match($request->getPathInfo());
```

<!--StartFragment-->

O método `match()` recebe um *request path* e retorna um array de atributos (note que a rota casada é armazenada automaticamente no atributo `_route`):

<!--EndFragment-->

```
print_r($matcher->match('/bye'));
/* Gives:
array (
  '_route' => 'bye',
);
*/

print_r($matcher->match('/hello/Fabien'));
/* Gives:
array (
  'name' => 'Fabien',
  '_route' => 'hello',
);
*/

print_r($matcher->match('/hello'));
/* Gives:
array (
  'name' => 'World',
  '_route' => 'hello',
);
*/
```

<!--StartFragment-->

> ***Nota:***O *request context* não é estritamente necessário em nossos exemplos, ele é usado em aplicações reais para garantir os requisitos dos métodos e mais.

O `UrlMatcher` lança uma excessão quando nenhuma de suas rotas casa com o path da requisição:

<!--EndFragment-->

```
$matcher->match('/not-found');

// throws a Symfony\Component\Routing\Exception\ResourceNotFoundException
```

<!--StartFragment-->

Agora que já temos uma visão geral de como esses novos componentes se relacionam, vamos escrever a nova versão do nosso framework:

<!--EndFragment-->

```
<?php //framework/web/front.php

require_once __DIR__.'/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing;

$request = Request::createFromGlobals();
$routes = include __DIR__.'/../src/app.php';

$context = new Routing\RequestContext();
$context->fromRequest($request);
$matcher = new Routing\Matcher\UrlMatcher($routes, $context);

try {
    extract($matcher->match($request->getPathInfo()), EXTR_SKIP);
    ob_start();
    include sprintf(__DIR__.'/../src/pages/%s.php', $_route);
    $response = new Response(ob_get_clean());
} catch (Routing\Exception\ResourceNotFoundException $exception) {
    $response = new Response('Not Found', 404);
} catch (Exception $exception) {
    $response = new Response('An error ocurred', 500);
}

$response->send();
```

<!--StartFragment-->

Há algumas novidades nesse código:

* Nomes das rotas são usados como os nomes dos templates.
* Erros `500` são gerenciados corretamente.
* Atributos da requisição são extraídos para manter nossos templates simples.

<!--EndFragment-->

```
<!-- example.com/src/pages/hello.php -->
Hello <?php echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8') ?>
```

<!--StartFragment-->

Configuração das rotas foi movida para seu próprio arquivo:

<!--EndFragment-->

```
<?php //framework/src/app.php

use Symfony\Component\Routing;

$routes = new Routing\RouteCollection();
$routes->add(
    'hello',
    new Routing\Route(
        '/hello/{name}',
        array('name' => 'World')
    )
);

$routes->add(
    'bye',
    new Routing\Route(
        'bye'
    )
);

return $routes;
```

<!--StartFragment-->

Agora nós temos uma clara separação entre configuração (tudo que é específico à nossa aplicação em `app.php`) e o framework (código genérico que dá poder a nossa aplicação em `front.php`).

Com menos de 50 linhas de código nós temos um framework mais poderoso e mais flexível do que o anterior. Aproveite!

Usar o componente `Routing` ainda nos dá mais uma grande vantagem: a habilidade de gerar URLs através das definições de `Route`. Quando estiver usando ambos os componentes *Url matching* e *URL generation*, mudar os padrões de URL não deverá ter nenhum impacto. Quer saber como usar o *Url generator*? Muito simples:

<!--EndFragment-->

```
use Symfony\Component\Routing;

$generator = new Routing\Generator\UrlGenerator($routes, $context);

echo $generator->generate('hello', array('name' => 'Fabien'));
// outputs /hello/Fabien
```

<!--StartFragment-->

O código deve ser auto-explicativo e graças ao *context*, você pode até gerar URLs absolutas:

<!--EndFragment-->

```
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

echo $generator->generate(
    'hello',
    array('name' => 'Fabien'),
    UrlGeneratorInterface::ABSOLUTE_URL
);
// outputs something like http://example.com/somewhere/hello/Fabien
```

<!--StartFragment-->

***Dica:***\
Está preocupado com a performance? Baseado nas suas definições de rotas, crie um uma classe UrlMatcher altamente otimizada que pode substituir a UrlMatcher padrão:

<!--EndFragment-->

```
$dumper = new Routing\Matcher\Dumper\PhpMatcherDumper($routes);

echo $dumper->dump();
```
