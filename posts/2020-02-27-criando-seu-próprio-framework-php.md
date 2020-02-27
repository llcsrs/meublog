---
title: Criando seu próprio framework PHP 5°
description: >-
  /**  * Este é o quinto de uma série de artigos traduzidos e adaptados  * a
  partir dos originais: "Create your own PHP Framework -  *
  http://symfony.com/doc/current/create_framework/index.html  * by Fabien
  Potencier.  */
date: '2020-02-27 11:51:25'
image: assets/img/php-900x506.jpg
category: dev
background: '#B31917'
---
![](assets/img/php-900x506.jpg)

<!--StartFragment-->

O leitor mais atento deve ter notado que nosso framework engessou a forma como o código dos templates é executado. Para páginas simples, como as que foram criadas até agora, isso não é um problema. Mas quando quisermos adicionar mais lógica, seremos forçados a colocar essa lógica diretamente nos templates, o que geralmente não é uma boa ideia. Ainda mais se você estiver seguindo o princípio *Separation of Concerns*.

Vamos separar o código do template da lógica de negócios adicionando uma nova camada: o *Controller*. A missão do controller é gerar uma resposta baseada nas informações contidas na requisição feita pelo cliente.

Altere a parte do nosso framework que trata da renderização dos templates para ficar da seguinte forma:

<!--EndFragment-->

```
<?php //framework/web/front.php

// ...
try {
    $request->attributes->add($matcher->match($request->getPathInfo()));
    $response = call_user_func('render_template', $request);
} catch (Routing\Exception\ResourceNotFoundException $exception) {
    $response = new Response('Not Found', 404);
} catch (Exception $exception) {
    $response = new Response('An error occurred', 500);
}
```

<!--StartFragment-->

Como agora a renderização está sendo realizada por uma função externa `render_template()` precisamos passar pra ela os atributos extraídos da URL. Nós poderíamos passar um argumento adicional, mas ao invés disso utilizaremos outra funcionalidade da classe *Request* chamada *attributes*: *Request attributes*é uma forma de adicionar ao objeto *Request* informações que não estão diretamente ligadas a requisição HTTP.

Com isso podemos criar a função `render_template()`, que nada mais é do que um controller genérico que renderiza templates quando não há nenhuma lógica específica.

Para manter o mesmo template anterior, os atributos da requisição são extraídos antes do template ser renderizado:

<!--EndFragment-->

```
function render_template($request)
{
    extract($request->attributes->all(), EXTR_SKIP);
    ob_start();
    include sprintf(__DIR__.'/../src/pages/%s.php', $_route);

    return new Response(ob_get_clean());
}
```

<!--StartFragment-->

Como `render_template` é utilizada através de um argumento passado para a função `call_user_func()`, podemos substituí-la por qualquer [callback](https://php.net/callback#language.types.callback) PHP válido. Isso possibilita o uso:

* de uma função.
* uma função anônima.
* ou o método de uma classe como um controller.

… você escolhe.

Por convenção, para cada rota, o controller associado é configurado pelo atributo `_controller` de um objeto *Router*:

<!--EndFragment-->

```
$routes->add('hello', new Routing\Route('/hello/{name}', array(
    'name' => 'World',
    '_controller' => 'render_template',
)));

try {
    $request->attributes->add($matcher->match($request->getPathInfo()));
    $response = call_user_func($request->attributes->get('_controller'), $request);
} catch (Routing\Exception\ResourceNotFoundException $exception) {
    $response = new Response('Not Found', 404);
} catch (Exception $exception) {
    $response = new Response('An error occurred', 500);
}
```

<!--StartFragment-->

Agora podemos associar uma rota a qualquer controller e é claro, dentro de um controller você ainda pode utilizar `render_template()` para renderizar um template:

<!--EndFragment-->

```
$routes->add('hello', new Routing\Route('/hello/{name}', array(
    'name' => 'World',
    '_controller' => function ($request) {
        return render_template($request);
    }
)));
```

<!--StartFragment-->

Isso é bem flexível pois você pode alterar o objeto *Response* posteriormente e até mesmo passar argumentos adicionais para o templete:

<!--EndFragment-->

```
$routes->add('hello', new Routing\Route('/hello/{name}', array(
    'name' => 'World',
    '_controller' => function ($request) {
        // $foo will be available in the template
        $request->attributes->set('foo', 'bar');

        $response = render_template($request);

        // change some header
        $response->headers->set('Content-Type', 'text/plain');

        return $response;
    }
)));
```

<!--StartFragment-->

Eis a versão atualizada e aprimorada do nosso framework:

<!--EndFragment-->

```
<?php //framework/web/front.php

require_once __DIR__.'/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing;

function render_template($request)
{
    extract($request->attributes->all(), EXTR_SKIP);
    ob_start();
    include sprintf(__DIR__.'/../src/pages/%s.php', $_route);

    return new Response(ob_get_clean());
}

$request = Request::createFromGlobals();
$routes = include __DIR__.'/../src/app.php';

$context = new Routing\RequestContext();
$context->fromRequest($request);
$matcher = new Routing\Matcher\UrlMatcher($routes, $context);

try {
    $request->attributes->add($matcher->match($request->getPathInfo()));
    $response = call_user_func($request->attributes->get('_controller'), $request);
} catch (Routing\Exception\ResourceNotFoundException $exception) {
    $response = new Response('Not Found', 404);
} catch (Exception $exception) {
    $response = new Response('An error occurred', 500);
}

$response->send();
```

<!--StartFragment-->

Para celebrar o nascimento do nosso novo framework, vamos criar uma nova aplicação que necessita de uma lógica simples. Nossa aplicação possui uma página que diz se um ano é bissexto ou não. Ao acessar `/is_leap_year`, você obtém a resposta para o ano corrente, mas você tembém pode especificar o ano desejado `/is_leap_year/2009`. Sendo genérico, o framework não precisa ser modificado, basta criar um novo arquivo `app.php`:

<!--EndFragment-->

```
<?php //framework/src/app.php

use Symfony\Component\Routing;
use Symfony\Component\HttpFoundation\Response;

function is_leap_year($year = null) {
    if (null === $year) {
        $year = date('Y');
    }

    return 0 === $year % 400 || (0 === $year % 4 && 0 !== $year % 100);
}

$routes = new Routing\RouteCollection();
$routes->add('leap_year', new Routing\Route('/is_leap_year/{year}', array(
    'year' => null,
    '_controller' => function ($request) {
        if (is_leap_year($request->attributes->get('year'))) {
            return new Response('Yep, this is a leap year!');
        }

        return new Response('Nope, this is not a leap year.');
    }
)));

return $routes;
```

<!--StartFragment-->

A função `is_leap_year()` retorna `true` quando o ano informado é bissexto, `false` caso contrário. Se o `$year` for `null`, o ano corrente é testado. O *controller* é simples: ele obtém o ano dos atributos da requisição, passa para a função `is_leap_year()`, de acordo com a resposta cria um novo objeto *Response*.

Como sempre, você pode parar por aqui e usar o framework como ele está. Provavelmente é só isso que você precisa para criar sites simples como [esses](https://kottke.org/08/02/single-serving-sites) e alguns outros.

- - -

<!--EndFragment-->
