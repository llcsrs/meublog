---
title: Criando seu próprio framework PHP 3°
description: >-
  /**  * Este é o terceiro de uma série de artigos traduzidos e adaptados  * a
  partir dos originais: "Create your own PHP Framework -  *
  http://symfony.com/doc/current/create_framework/index.html  * by Fabien
  Potencier.  */
date: '2020-02-27 12:40:13'
image: assets/img/php-900x506.jpg
category: dev
background: '#B31917'
---
![](assets/img/php-900x506.jpg)

<!--StartFragment-->

Até agora nossa aplicação está bem simples, já que temos somente uma única página. Vamos fazer uma loucura e adicionar outra página que diz "Goodbye!":

<!--EndFragment-->

```
<?php // framework/bye.php

require_once __DIR__.'/vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();

$response = new Response('Goodbye!');
$response->send();
```

<!--StartFragment-->

Como você pode ver, grande parte do código é o mesmo que escrevemos para nossa primeira página `index.php`. Vamos extrair o código que é comum entre essas duas páginas e que também poderemos compartilhar entre todas as outras. Compartilhamento de código parece um bom plano para criarmos o nosso primeiro framework de verdade!

Pelo jeito PHP de fazer as coisas provavelmente teríamos um arquivo de include:

<!--EndFragment-->

```
<?php // framework/init.php

require_once __DIR__.'/vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();
$response = new Response();
```

<!--StartFragment-->

Colocando isso pra funcionar:

<!--EndFragment-->

```
<?php // framework/index.php

require_once __DIR__.'/init.php';

$input = $request->get('name', 'World');

$response->setcontent(sprintf('Hello %s', htmlspecialchars($input, ENT_QUOTES, 'UTF-8')));
$response->send();
```

<!--StartFragment-->

E para a página de "Goodbye":

<!--EndFragment-->

```
<?php // framework/bye.php

require_once __DIR__.'/init.php';

$response->setContent('Goodbye!');
$response->send();
```

<!--StartFragment-->

De fato, nós movemos a maior parte do código compartilhado para um lugar centralizado, mas isso não parece uma boa abstração, certo? Nós ainda temos o método `send()` em todas as páginas, nossas páginas não se parecem com templates e ainda não somos capazes de testar esse código devidamente.

Além disso, criar uma nova página significa que precisamos criar um novo script PHP, cujo nome será exposto ao usuário final pela URL `http://localhost:4321/bye.php`, onde há um mapeamento direto entre o nome do script PHP e a URL do cliente. Isso acontece porque o envio (dispatch) da requisição é feito diretamente pelo servidor web. Pode ser uma boa ideia mover o processo de *dispatch* para a nossa aplicação para termos mais versatilidade. Isso pode ser facilmente implementado roteando todas as requisições dos clientes para um único script PHP.

> ***Dica:***Expor um único script PHP para o usuário final é um Design Pattern chamado "[front controller](http://symfony.com/doc/current/introduction/from_flat_php_to_symfony2.html#from-flat-php-front-controller)".

Tal script vai pode ser implementado da seguinte forma:

<!--EndFragment-->

```
<?php //framework/front.php

require_once __DIR__.'/vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();
$response = new Response();

$map = array(
    '/hello' => __DIR__.'/hello.php',
    '/bye'   => __DIR__.'/bye.php',
);

$path = $request->getPathInfo();
if (isset($map[$path])) {
    require $map[$path];
} else {
    $response->setStatusCode(404);
    $response->setContent('Not Found');
}

$response->send();
```

<!--StartFragment-->

E os scripts `hello.php` e `bye.php`:

<!--EndFragment-->

```
<?php // framework/hello.php

$input = $request->get('name', 'World');
$response->setContent(sprintf('Hello %s', htmlspecialchars($input, ENT_QUOTES, 'UTF-8')));
```

```
<?php // framework/bye.php

$response->setContent('Goodbye!');
```

<!--StartFragment-->

No script `front.php`, a variável `$map` associa URLs com seus scripts PHP correspondentes.

Como bônus, se o cliente requisitar um path não definido em `$map`, nós retornamos uma página 404 personalizada. Com isso você obtém o controle total da sua aplicação web.

Para acessar uma página, você deve usar o `front.php`:

<!--EndFragment-->

```
    http://localhost:4321/front.php/hello?name=Fabien
    http://localhost:4321/front.php/bye
```

<!--StartFragment-->

`/hello` e `/bye` são os paths para as páginas.

O truque é usar o método `Request::getPathInfo()` que retorna o path da requisição removendo o nome do script front controller.

> ***Dica:***\
> A maioria dos servidores web como o Apache e o Nginx são capazes de redirecionar todas as requisições para o `front.php` de forma que que os usuários só precisem digitar: `http://localhost:4321/hello?name=Fabien`.

Agora que o servidor web sempre acessa o mesmo script (`front.php`) para todas as páginas, nós podemos deixar o código mais seguro movendo todos os outros arquivos PHP para fora o diretório raiz do servidor web (`DocumentRoot`):

<!--EndFragment-->

```
framework
├── composer.json
├── composer.lock
├── src
│   └── pages
│       ├── hello.php
│       └── bye.php
├── vendor
│   └── autoload.php
└── web
    └── front.php
```

<!--StartFragment-->

Configure o `DocumentRoot` do seu servidor web para apontar para o diretório `web` e todos os outros arquivos não serão mais acessíveis pelo cliente.

Ou você pode usar o próprio servidor web embutido no PHP:

<!--EndFragment-->

```
php -S 127.0.0.1:4321 -t web/ web/front.php
```

<!--StartFragment-->

> ***Nota:***\
> Para essa nova estrutura funcionar o path de alguns arquivos devem ser ajustados.

Para testar as alterações no browser, acesse `http://localhost:4321/hello?name=Fabien`.

A última coisa que está sendo repetida em todas as páginas é a chamada ao método `setContent()`. Podemos converter todas as páginas para "templates" simplesmente dando `echo` no conteúdo e chamando `setContent()` diretamente do script front controller:

<!--EndFragment-->

```
<?php //framework/web/front.php

// ...

$path = $request->getPathInfo();
if (isset($map[$path])) {
    ob_start();
    require $map[$path];
    $response->setContent(ob_get_clean());
} else {
    $response->setStatusCode(404);
    $response->setContent('Not Found');
}

// ...
```

<!--StartFragment-->

Agora os scripts `hello.php` e `bye.php` podem ser convertidos em templates:

<!--EndFragment-->

```
<!-- framework/src/pages/hello.php -->
<?php $name = $input = $request->get('name', 'World') ?>

Hello <?php echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8') ?>
```

```
<!-- framework/src/pages/bye.php -->

Goodbye!
```

<!--StartFragment-->

Temos a primeira versão do nosso framework:

<!--EndFragment-->

```
<?php //framework/web/front.php

require_once __DIR__.'/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();
$response = new Response();

$map = array(
    '/hello' => __DIR__.'/../src/pages/hello.php',
    '/bye'   => __DIR__.'/../src/pages/bye.php',
);

$path = $request->getPathInfo();
if (isset($map[$path])) {
    ob_start();
    require $map[$path];
    $response->setContent(ob_get_clean());
} else {
    $response->setStatusCode(404);
    $response->setContent('Not Found');
}

$response->send();
```

<!--StartFragment-->

Adicionar novas páginas é um processo de duas etapas:

1. Adicionar uma entrada ao mapa de URLs, o array`$map`.
2. Criar o template PHP em `src/pages/`.

A partir do template é possível acessar os dados da requisição através da variável `$request` e personalizar os cabeçalhos da resposta via `$response`.

> ***Nota:***\
> Se você decidir parar por aqui, você pode melhorar seu framework extraindo o mapeamento das URLs para um arquivo de configuração.

<!--EndFragment-->
