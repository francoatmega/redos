# ReDoS, negação de serviço com expressões regulares

## O que é uma expressão regular?

Uma expressão regular (regex) é uma sequência de caracteres que especificam um padrão de busca. É definida como uma [linguagem formal](https://pt.wikipedia.org/wiki/Linguagem_formal) e surgiu a partir dos estudos do matemático [Stephen Cole Kleene](https://pt.wikipedia.org/wiki/Stephen_Kleene).

## Onde são utilizadas expressões regulares?

Expressões regulares especificam padrões, então são bastante utilizadas para validar ou mesmo para extrair dados. Abaixo temos um exemplo de uma regex que identifica se um determinado texto contém um CPF:

\d{3}\.\d{3}\.\d{3}\-\d{2}

O padrão que a regex acima expecifica é de três dígitos seguido de um ponto, depois mais três dígitos seguidos de outro ponto, depois mais três dígitos seguidos de um traço e por fim seguidos de dois dígitos.

```
/\d{3}\.\d{3}\.\d{3}\-\d{2}/.test('Meu CPF é 000.000.000-00')
```

O retorno do código acima será true, pois o padrão `\d{3}\.\d{3}\.\d{3}\-\d{2}`, foi identificado no texto `Meu CPF é 000.000.000-00`.

Expressões regulares também podem ser utlizadas para extrair dados de um texto, a regex `\D+`, pode ser usada para extrair todos os dígitos de uma determinada string, da seguinte forma:

```
'Meu CPF é 000.000.000-00'.replace('\D+', '')
```

O retorno do código acima será: 00000000000

A regex `\D+` especifica o padrão de tudo que não for dígito que tem um tamanho de pelo menos um e de no máximo n vezes.

As regex podem ser e são utilizadas em uma variadade de contextos, desde de validação de dados até softwares como editores de textos, IDEs, compiladores, scrapping e inúmeras outras utilidades.

## O que é um ataque ReDoS?

ReDoS é o acrônimo de Regular Expression Denial of Service, o que pode ser traduzido em ataque de Negação de Serviço de Expressão Regular.
É um ataque que afeta a disponibilidade de um sistema, ele é viável devido a implementação de alguns algoritmos de análise de expressões regulares, 
que possuem uma complexidade algorítmica exponencial no pior caso. Sendo assim uma falha de ReDoS explorada com sucesso pode fazer com que um
sistema demore tempo demais para analisar uma expressão regular e consuma muito recurso de processamento, deixando o sistema lento ou até mesmo 
inviabilizando o serviço.

## Como funciona um ataque ReDoS?

Algumas implementações de algoritmos de interpretação de expressões regulares utilizam uma técnica chamada "backtracking", que é bastante utilizada
em algoritmos de busca. Utilizando essa técnica o algoritmo tenta encontrar todos os caminhos possíveis para um problema, em um determinado passo da busca caseo ele não encontre nada, ele retorna ao estado de busca anterior e
tenta buscar por outro caminho, e continua fazendo esse processo até que todas as possibilidades tenham sido esgotadas.

//Mostrar exemplos de regex maliciosas

Essa regex é afetada pelo backtracking dependendo da entrada do usuário:

(a|a)+$

/(a|a)+$/.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!')

Tente rodar o código acima no node e você verá que ele irá demorar muito, mas muito tempo para processar essa regex, se ele não travar
(o que pode ocorrer também)Exemplos de software que possuíam falhas ReDoS

## Como um expressão regular pode derrubar meu sistema?

Agora que já vimos um pouco de teoria vamos para a parte prática. Já vimos o que são regex, como são processadas, quais as vulnerabilidades que pode ser exploradas, e alguns exemplos mais triviais. Mas será que essa falha pode ser explorar em um ambiente real, de produção, será se meu sistema tá vulnerável a esse tipo de ataque?Bem, veremos abaixo alguns softwares que tiveram falhas reportadas de ReDoS, e se você estiver utilizando  alguma versão que demonstrarei abaixo, sugiro atualizar o seu ambiente o quanto antes.

* Demonstrar a possibilidade da falha em um modelo do Sequelize

* Demonstrar a possibilidade da falha em uma API que valida com o validator JS

Vamos primeiro para um dos ORMs mais conhecidos e utilizados do NodeJS, o Sequelize, a versão 6.6.4 está vulnerável, vamos tentar reproduzir a falha localmente:

Primeiro iremos criar uma simples aplicação e um modelo simples:

Nesse modelos adicionaremos alguma validação nele, não se atente aos detalhes de implementação, isso é apenas para fins demonstrativos:Depois iremos servir isso em alguma API:E iremos passar para essa API o seguinte e-mail:
https://www.npmjs.com/browse/depended/validator
Versão 13.5.1 do validator JS é vulnerável a esse tipo de ataque
Versão v6.6.4 do Sequelize está usando a versão vulnerável do express validatorhttps://github.com/validatorjs/validator.js/issues/1597
https://github.com/validatorjs/validator.js/pull/1651
https://github.com/validatorjs/validator.js/issues/1596
https://github.com/validatorjs/validator.js/issues/1599
https://github.com/segmentio/is-email
https://github.com/parallax/jsPDF/commit/d8bb3b39efcd129994f7a3b01b632164144ec43e

Outras falhas fora do JS https://discuss.rubyonrails.org/t/cve-2021-22880-possible-dos-vulnerability-in-active-record-postgresql-adapter/77129https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=REDoSComo se previnir de ataques do tipo

Usar uma lib de terceiros para fazer validação de regex. Se atentar ao criar regex que não possuam repetição e caminhos alternativos

Usar alguma linguagem que não possua backtracking.

https://github.com/davisjam/vuln-regex-detector
https://github.com/davisjam/safe-regex

https://github.com/google/re2 - Lib que n usa backtrack
https://www.npmjs.com/package/re2

Referências
https://regex101.com/
https://en.wikipedia.org/wiki/Regular_expression
https://www.regular-expressions.info/catastrophic.html
https://levelup.gitconnected.com/the-regular-expression-denial-of-service-redos-cheat-sheet-a78d0ed7d865https://lirantal.medium.com/node-js-pitfalls-how-a-regex-can-bring-your-system-down-cbf1dc6c4e02https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS
https://github.com/iaK/regexbuilder