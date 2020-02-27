---
title: Criando seu próprio framework PHP 2°
description: >-
  /**  * Este é o segundo de uma série de artigos traduzidos e adaptados  * a
  partir dos originais: "Create your own PHP Framework -  *
  http://symfony.com/doc/current/create_framework/index.html  * by Fabien
  Potencier.  */
date: '2020-02-27 12:54:46'
image: assets/img/phpframe.png
category: dev
background: '#B31917'
---
![](assets/img/phpframe.png)

<!--StartFragment-->

Antes de mergulhar de cabeça no processo de criação de um framework, vamos dar um passo para trás e analisar porque você iria querer utilizar um framework ao invés de conjunto de scripts PHP como se fazia antigamente. E ainda por que utilizar um framework é uma boa ideia, mesmo para pequenos projetos e também por que criar seu framework utilizando os componentes do Symfony é melhor do que fazê-lo do zero.

> ***Nota:***\
> Não vamos falar sobre os benefícios óbvios e tradicionais de se utilizar um framework quando trabalhando em grandes aplicações com pouco mais do que dois ou três desenvolvedores; a Internet já possui uma ampla gama de materiais sobre este tópico.

Até mesmo uma "aplicação" simples como a foi desenvolvida no [artigo anterior](https://medium.com/operacionalti/criando-seu-próprio-framework-php-3ba4ced2553e) possui alguns problemas:

<!--EndFragment-->

```
<?php

// framework/index.php
$input = $_GET['name'];

printf('Hello %s', $input);
```

<!--StartFragment-->

Primeiro, se o parâmetro `name` não estiver definido na *[query string](https://en.wikipedia.org/wiki/Query_string)* da URL, você vai receber um `PHP Warning`. Portanto, vamos corrigir isso:

<!--EndFragment-->

```
<?php

// framework/index.php
$input = isset($_GET['name']) ? $_GET['name'] :  'World';

printf("Hello %s", $input);
```

<!--StartFragment-->

De qualquer forma esta aplicação não é segura. Dá pra acreditar? Mesmo esse simples trecho de código PHP está vulnerável a uma das mais difundidas falhas de segurança da Internet, o XSS ou [Cross-Site Scripting](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)). Eis uma versão mais segura:

<!--EndFragment-->

```
<?php

// framework/index.php
$input = isset($_GET['name']) ? $_GET['name'] :  'World';

header('Content-Type: text/html; charset=utf-8');

printf("Hello %s", htmlspecialchars($input, ENT_QUOTES, 'UTF-8'));
```

<!--StartFragment-->

> ***Nota:***\
> Você deve ter notado que deixar seu código mais seguro através da função `htmlspecialchars` é tedioso e propenso a erros. Essa é uma das razões pela qual usar um template engine como o [Twig](https://twig.symfony.com), onde o scaping está ativo por padrão, pode ser uma boa ideia (além disso fazer o scaping explicitamente é menos penoso, basta utilizar o filtro `e`).

Observe que se quisermos evitar as mensagens de *warning/notice*do PHP e deixar nosso código mais seguro, aquele simples código que foi escrito no início não será tão simples assim.

Além da segurança, esse código não é facil de testar. Mesmo que não haja muito para se testar. Escrever testes para este simples trecho de código não é natural e parece horrível, pelo menos pra mim. Eis uma tentativa de escrever um teste unitário para o código acima:

<!--EndFragment-->

```
<?php

// framework/tests/indexTest.php
use PHPUnit\Framework\TestCase;

class IndexTest extends TestCase
{
  public function testHello()
  {
    $_GET['name'] = 'Fabien';

    ob_start();
    include 'index.php';
    $content = ob_get_clean();

    $this->assertEquals('Hello Fabien', $content);
  }
}
```

<!--StartFragment-->

> ***Nota:***\
> Se nossa aplicações fosse um pouco maior, seríamos capazes de encontrar ainda mais problemas. Caso esteja curioso sobre esses problemas, leia [Symfony versus Flat PHP](http://symfony.com/doc/current/introduction/from_flat_php_to_symfony2.html).

Se até agora você ainda não estiver convencido de que a questão da segurança e dos testes são dois bons motivos para você parar des escrever código PHP do jeito antigo e adotar um framework, pode parar de ler meus artigos e voltar a trabalhar no código que você estava trabalhando.

> ***Nota:***\
> É claro que adotar um framework irá te proporcionar mais do que somente segurança e testabilidade, no entanto é mais importante ter em mente que o framework que você escolher deve permitir que você escreva códigos melhores e de forma mais rápida.

## Orientação a Objetos com o componente *HttpFoundation*

Programar para a web é interagir com o protocolo HTTP. Dessa forma nosso framework deve estar focado na [especificação HTTP.](http://tools.ietf.org/wg/httpbis/)

A especificação HTTP descreve como um **cliente** (como um browser), interage com um **servidor** (nossa aplicação, através de um servidor web). O **diálogo** entre o cliente e o servidor é especificado por um conjunto de ***mensagens*** bem definidas, ***requisições*** e ***respostas*** (`requests/responses`).

> O cliente envia uma requisição ao servidor que, baseado nessa requisição, envia uma resposta ao cliente.

No PHP a requisição é representada por variáveis globais (`$_GET`, `$_POST`, `$_FILE`, `$_COOKIE`, `$_SESSION`) e a resposta é gerada por funções (`echo`, `header`, `setcookie`, …).

O primeiro passo para melhorar nosso código é utilizar uma abordagem Orientada Objetos, este é o principal objetivo do componente [HttpFoundation](https://symfony.com/doc/current/components/http_foundation.html): substituir as variáveis globais padrões do PHP e suas funções por uma camada Orientada a Objetos.

Para utilizar este componente, temos que adicioná-lo como uma dependência do nosso framework:

<!--EndFragment-->

```
composer require symfony/http-foundation
```

<!--StartFragment-->

odando este comando o composer irá baixar e instalar o componente HttpFoundation na pasta `vendor/`. Além disso os arquivos `composer.json` e `composer.lock` serão criados ou atualizados para refletir este novo requisito do nosso framework.

> ***Class Autoloading***Quando você instala uma dependência pelo composer, ele gera ou atualiza o `vendor/autoload.php`. Este script possibilita que qualquer classe seja automaticamente carregada ([autoload](http://php.net/autoload)). Sem este recurso você teria que incluir o arquivo onde a classe foi definida antes de poder utilizá-la. Mas graças ao [PSR-4](http://www.php-fig.org/psr/psr-4/), podemos confiar no composer e no PHP para fazer o duro por nós.

Agora vamos reescrever nossa aplicação tirando proveito das classes`Request` e `Response`:

<!--EndFragment-->

```
<?php

// framework/index.php
require_once __DIR__.'/vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();

$input = $request->get('name', 'World');

$response = new Response(
  sprintf('Hello %s', htmlspecialchars($input, ENT_QUOTES, 'UTF-8'))
);

$response->send();
```

<!--StartFragment-->

O método `createFromGlobals()` cria um objeto `Request` a partir no conteúdo atual das variáveis globais do PHP.

O método `send()` envia o objeto `Response` de volta ao cliente (ele primeiro produz os cabeçalhos HTTP seguidos pelo corpo da resposta).

> ***Dica:***\
> Antes de chamar o método `send()` nós deveríamos ter adicionado uma chamada ao método `prepare()`: `$response->prepare($request);` para garantir que nossa resposta esteja de acordo com a especificação HTTP. Por exemplo, se tivéssemos acessado a página através do método `HEAD`, o `prepare()` teria removido o conteúdo da resposta.

A principal diferença desse novo código é que você tem total controle das mensagens HTTP. Você pode criar a requisição que quiser e enviar a resposta quando achar apropriado.

> ***Nota:***\
> Nós não definimos explicitamente o cabeçalho `Content-Type` na resposta porque o charset padrão do objeto `Response` já é UTF-8.

Através da classe `Request`, você tem na ponta dos dedos qualquer informação da requisição HTTP, graças a uma simples e agradável API:

<!--EndFragment-->

```
<?php

// a URI requisitada (ex: /about) menos a query string
$request->getPathInfo();

// recebe variáveis GET['foo'] e POST['bar'] respectivamente
$request->query->get('foo');
$request->request->get('bar', 'valor padrão, caso "bar" no exista');

// recebe variáveis do array $_SERVER
$request->server->get('HTTP_HOST');

// recebe uma instância de UploadedFile identificado por foo
$request->files->get('foo');

// recebe o valor de um COOKIE
$request->cookies->get('PHPSESSID');

// recebe um cabeçalho HTTP, com as chaves normalizadas em minúsculas
$request->headers->get('host');
$request->headers->get('content_type');

$request->getMethod();    // GET, POST, PUT, DELETE, HEAD
$request->getLanguages(); // um array com as linguagens aceitas pelo cliente
```

<!--StartFragment-->

Também podemos simular uma requisição:

<!--EndFragment-->

```
$request = Request::create('/index.php?name=Fabien');
```

<!--StartFragment-->

Com a classe `Response`, você pode ajustar facilmente a resposta:

<!--EndFragment-->

```
<?php

$response = new Response();

$response->setContent('Hello world!');
$response->setStatusCode(200);
$response->headers->set('Content-Type', 'text/html');

// configura os cabeçalhos de cache HTTP
$response->setMaxAge(10);
```

<!--StartFragment-->

> ***Dica:***\
> Para debugar uma resposta, faça o *cast* dela para string. Será devolvido a representação HTTP da resposta (cabeçalhos e corpo).

Por último, mas não menos importante, essa classe, assim como qualquer outra classe no código do Symfony, foi [auditada](https://symfony.com/blog/symfony2-security-audit) por uma empresa independente em busca de falhas de segurança. Além disso, sendo um projeto Open Source, significa que diversos programadores do mundo todo também leram o código e já corrigiram possíveis falhas de segurança. Quando foi a última vez que você contratou uma equipe de profissionais para auditar o código fonte do seu próprio framework?

Até mesmo um procedimento simples como pegar o endereço IP do cliente pode ser inseguro:

<!--EndFragment-->

```
if ($myIp === $_SERVER['REMOTE_ADDR']) {
    // o cliente é conhecido, então daremos a ele mais privilégios
}
```

<!--StartFragment-->

sso funciona sem nenhum problema até você colocar um proxy reverso na frente dos seus servidores web. Fazendo isso você terá que modificar seu código para que ele funcione em seu ambiente de desenvolvimento, onde você provavelmente não tem um proxy reverso, e também no seu ambiente de produção:

<!--EndFragment-->

```
if ($myIp === $_SERVER['HTTP_X_FORWARDED_FOR'] || 
    $myIp === $_SERVER['REMOTE_ADDR']) {
    // o cliente é conhecido, então daremos a ele mais privilégios
}
```

<!--StartFragment-->

O método `Request::getClientIp()` proporcionaria o comportamento esperado desde o início, cobrindo até os casos em que você tenha uma cadeia de proxies reversos:

<!--EndFragment-->

```
$request = Request::createFromGlobals();

if ($myIp === $request->getClientIp()) {
    // o cliente é conhecido, então daremos a ele mais privilégios
}
```

<!--StartFragment-->

Além disso ainda há um benefício extra: esse método é seguro por padrão. O que isso significa? Você não pode confiar no valor de `$_SERVER['HTTP_X_FORWARDED_FOR']` pois ele pode ser manipulado pelo usuário quando não há um proxy na frente dos seus servidores web. Por isso, se você estiver utilizando aquele código que faz referência direta ao array `$_SERVER` em produção e sem ter um proxy, seria trivial abusar do seu sistema. No entanto este não é o caso com o método `getClientIp()`, onde você deve explicitamente determinar quais são os IPs dos seus proxies reversos chamando o método`setTrustedProxies()`:

<!--EndFragment-->

```
Request::setTrustedProxies(array('10.0.0.1'));

if ($myIp === $request->getClientIp()) {
    // o cliente é conhecido, então daremos a ele mais privilégios
}
```

<!--StartFragment-->

O método `getClientIp()` funcionará de forma segura em qualquer circunstância. Você pode utilizá-lo em todos os seus projetos, qualquer que sejam as configurações, ele vai se comportar de forma correta e confiável.

Esse é só mais um dos benefícios de se utilizar um framework. Se você tivesse que escrever um framework por conta própria, você teria que pensar em todos esses cenários por conta própria. Então por que não utilizar uma tecnologia que já funciona?

> ***Nota:***\
> Se você quiser aprender mais sobre o componente HttpFoundation, você pode dar uma olhada na sua [API](http://api.symfony.com/4.0/Symfony/Component/HttpFoundation.html) ou ler sua [documentação](http://symfony.com/doc/current/components/http_foundation.html).

Acredite ou não, nós já temos nosso primeiro framework. Você pode parar por aqui se você quiser. Somente o componente HttpFoundation do Symfony já possibilita que você escreva códigos melhores e mais testáveis. Além disso ele possibilita que você programe mais rápido, já que muitos dos problemas do dia-a-dia já foram resolvidos para você.

> Projetos como Drupal e Laravel adotaram o componente HttpFoundation; se funciona para eles, provavelmente vai funcionar para você. Não reinvente a roda.

Quase esqueci de mencionar outro benefício: usar o componente HttpFoundation é o ponto de partida para uma melhor interoperabilidade entre todos os frameworks e aplicações que o utilizam, como [Symfony](https://symfony.com/), [Drupal 8](https://drupal.org/), [phpBB 3](https://www.phpbb.com/), [ezPublish 5](http://ez.no/), [Laravel](http://laravel.com/), [Silex](http://silex.sensiolabs.org/) e outros.

<!--EndFragment-->
