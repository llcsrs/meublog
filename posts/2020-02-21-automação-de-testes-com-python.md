---
title: Automação de testes com Python
description: >-
  Este tutorial tem como objetivo explicar o uso básico de Selenium com Python
  para automação de testes. A estrutura utilizada é a de PageObjects com escrita
  de testes em BDD pelo framework Behave.  O projeto base está disponível para
  download no GitHub https://github.com/llcsrs/AutomacaoExemplo
date: '2020-02-21 02:07:21'
image: assets/img/python.png
category: dev
background: '#637a91'
---
<!--StartFragment-->

# Configuração do Ambiente

**1.** Instale a versão atualizada do Python: [acesse aqui](https://www.python.org/).

Tenha certeza de que a instalação foi feita com sucesso verificando a versão do Python e do Pip:

<!--EndFragment-->

<!--StartFragment-->

Instale as dependências necessárias para o projeto de automação.

Execute no terminal os seguintes comandos:

<!--EndFragment-->

<!--StartFragment-->

```
pip install selenium
pip install behave
pip install nose
```

<!--EndFragment-->

<!--StartFragment-->

# Uso básico do Selenium

Para entender melhor os comandos do Selenium, vamos executar um teste simples. Crie um arquivo `basico_selenium.py` e adicione o seguinte código:

<!--EndFragment-->

<!--StartFragment-->

| from selenium import webdriver |
| ------------------------------ |
|                                |

|     |
| --- |
|     |

| driver = webdriver.Chrome() # Inicia o browser |
| ---------------------------------------------- |
|                                                |

| driver.get('https://www.python.org/') # Acessar a URL especificada |
| ------------------------------------------------------------------ |
|                                                                    |

| driver.find_element_by_css_selector('#id-search-field').send_keys("python") # Digita o texto "python" no input |
| -------------------------------------------------------------------------------------------------------------- |
|                                                                                                                |

| driver.find_element_by_css_selector('#submit').click() # Clica no botão de submit |
| --------------------------------------------------------------------------------- |
|                                                                                   |

driver.quit() # Encerra o browser

<!--EndFragment-->

<!--StartFragment-->

Para rodar o teste, execute o arquivo pelo terminal:

`python basico_selenium.py`

Está pronto nosso primeiro teste automatizado com Python e Selenium utilizando os comandos mais comuns.

- - -

# Utilizando o Behave

Behave é um framework que permite a escrita de testes automatizados em BDD (Behaviour-Driven Development) no Python. Utilizaremos ele juntamente com o Selenium para estruturar nosso projeto.

## **Estrutura do projeto**

<!--EndFragment-->

![](assets/img/pastas.png)

<!--StartFragment-->

**Features:** pasta que armazena os arquivos `.feature` utilizados para a escrita dos testes em BDD.

**Pages:** armazena os arquivos que contêm os seletores e os comandos executados em cada página.

**Steps:** armazena os arquivos com os steps do BDD. Responsável por conectar os steps escritos em BDD com o código das pages.

**Browser.py:** arquivo de configurações relacionadas ao browser.

**Environment.py:** arquivo de configurações relacionadas à execução dos testes.

## **Implementação:**

**1.** Crie um arquivo chamado `google.feature` dentro da pasta features. Nele escreveremos nosso teste em BDD.

<!--EndFragment-->

<!--StartFragment-->

| \# language: pt |
| --------------- |
|                 |

|     |
| --- |
|     |

| Funcionalidade:realizar pesquisa no Google |
| ------------------------------------------ |
|                                            |

|     |
| --- |
|     |

| \# Contexto são ações que serão executadas antes de cada cenário. |
| ----------------------------------------------------------------- |
|                                                                   |

| Contexto:acessar página de teste |
| -------------------------------- |
|                                  |

| Dadoque acesso a página do Google |
| --------------------------------- |
|                                   |

|     |
| --- |
|     |

| Cenário:acessar página do Google e realizar pesquisa |
| ---------------------------------------------------- |
|                                                      |

| Dadoque preencho o campo de pesquisa com Python |
| ----------------------------------------------- |
|                                                 |

| Quandoclico no botão de pesquisar |
| --------------------------------- |
|                                   |

Entãodevo visualizar os resultados

<!--EndFragment-->

<!--StartFragment-->

Execute no terminal o comando `behave`. Os steps digitados em BDD serão escritos em python. Basta copiar e colar dentro do arquivo `google_steps.py`, que deve ser criado dentro da pasta steps.

<!--EndFragment-->

![](assets/img/rodando py.png)

<!--StartFragment-->

Assim deve ficar o arquivo `google_steps.py`:

<!--EndFragment-->

```
from behave import *


@given('que acesso a página do Google')
def step_impl(context):
    raise NotImplementedError(u'STEP: Given que acesso a página do Google')


@given('que preencho o campo de pesquisa com Python')
def step_impl(context):
    raise NotImplementedError(u'STEP: Given que preencho o campo de pesquisa com Python')


@when('clico no botão de pesquisar')
def step_impl(context):
    raise NotImplementedError(u'STEP: When clico no botão de pesquisar')


@then('devo visualizar os resultados')
def step_impl(context):
    raise NotImplementedError(u'STEP: Then devo visualizar os resultados')
```

<!--StartFragment-->

Na raiz do projeto, crie um arquivo chamado `browser.py`, no qual colocaremos as configurações de nosso browser. Executaremos o teste no Chrome, mas o browser pode ser alterado no comando `webdriver.Chrome()` por outro como o Firefox, Safari ou IE.

Além disso, criaremos uma função para fechar o browser depois de todos os testes serem finalizados e outra função para limpar o browser entre cada cenário.

<!--EndFragment-->

```
from selenium import webdriver


class Browser(object):
    # Inicia o browser chrome, mas pode ser feito com outros como Firefox, Safari e IE
    driver = webdriver.Chrome()
    # Define o tempo máximo para carregamento da página
    driver.set_page_load_timeout(30)
    # Maximiza a janela do browser ao ser iniciado
    driver.maximize_window()
    
    # Fecha o browser
    def browser_quit(self):
        self.driver.quit()
    
    # Limpa o browser
    def browser_clear(self):
        self.driver.delete_all_cookies()
        self.driver.execute_script('window.localStorage.clear()')
        self.driver.execute_script('window.sessionStorage.clear()')
        self.driver.refresh()
```

<!--StartFragment-->

Também na raiz do projeto, crie o arquivo `environment.py`. Adicionaremos nele comandos para serem executados automaticamente antes (`before_all`) e depois (`after_all`) de todos os cenários e entre cada cenário (`after_scenario`).

<!--EndFragment-->

```
from browser import Browser


# executa os comandos antes de todos os testes iniciarem
def before_all(context):
    context.browser = Browser()


# executa os comandos depois de todos os testes terminarem
def after_all(context):
    context.browser.browser_quit()


# executa os comandos entre cada cenário
def after_scenario(context, scenario):
    context.browser.browser_clear()
```

<!--StartFragment-->

Dentro da pasta page, crie o arquivo `google_page.py`. Colocaremos nele todos os comandos executados na página do Google e também os seletores.

<!--EndFragment-->

```
rom selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from browser import Browser


class GooglePageLocator(object):
    # Seletores dos elementos utilizados na página
    INPUT_PESQUISA = '[name="q"]'
    BUTTON_PESQUISAR = '.FPdoLc [name="btnK"]'
    TITLE_RESULTADO = '[data-attrid="title"]'


class GooglePage(Browser):
    def get_element(self, locator):
        # aguarda elemento estar visível na tela
        WebDriverWait(self.driver, 10).until(ec.visibility_of_element_located((By.CSS_SELECTOR, locator)))
        # retorna elemento
        return self.driver.find_element(By.CSS_SELECTOR, locator)

    def acess_page(self, url):
        # acessa url passada
        self.driver.get(url)

    def send_keys_input_pesquisa(self):
        # envia para o elemento o texto 'Python'
        input_pesquisa = self.get_element(GooglePageLocator.INPUT_PESQUISA)
        input_pesquisa.send_keys('Python')

    def click_button_pesquisar(self):
        # clica no botão de pesquisar
        button = self.get_element(GooglePageLocator.BUTTON_PESQUISAR)
        button.click()

    def get_text_title_resultado(self):
        # retorna o texto do elemento
        element = self.get_element(GooglePageLocator.TITLE_RESULTADO)
        return element.text
```

<!--StartFragment-->

Precisamos agora atualizar o `google_steps.py`, chamando as funções que criamos no `google_page.py`.

<!--EndFragment-->

```
from behave import *
from nose.tools import assert_equal
from pages.google_page import GooglePage

googlePage = GooglePage()


@given('que acesso a página do Google')
def step_impl(context):
    googlePage.acess_page('https://www.google.com.br/')


@given('que preencho o campo de pesquisa com Python')
def step_impl(context):
    googlePage.send_keys_input_pesquisa()


@when('clico no botão de pesquisar')
def step_impl(context):
    googlePage.click_button_pesquisar()


@then('devo visualizar os resultados')
def step_impl(context):
    assert_equal(googlePage.get_text_title_resultado(), 'Python')
```

<!--StartFragment-->

## Execução do teste:

Finalizada a implementação, basta executar o código `behave` na raiz do projeto para rodar os testes.

<!--EndFragment-->

![](assets/img/teste rodando.png)

<!--StartFragment-->

O teste será executado e os resultados serão apresentados no próprio terminal.

<!--EndFragment-->

<!--StartFragment-->

# Conclusão

O que foi exposto acima é o básico para implementar testes automatizados com Python. Entretanto, muitas outras funcionalidades são possíveis, como, por exemplo, o uso de tags e a criação de cenários de teste com exemplos. Aproveite para aprofundar seus estudos e aprimore cada vez mais os seus testes.

<!--EndFragment-->
