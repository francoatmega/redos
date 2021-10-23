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

A regex `\D+` especifica o padrão de tudo que não for dígito que tem um tamanho de pelo menos um e de no máximo n caracteres.

As regex podem ser e são utilizadas em uma variadade de contextos, desde de validação de dados até softwares como editores de textos, IDEs, compiladores, scrapping e inúmeras outras utilidades.

## O que é um ataque ReDoS?

ReDoS ([CWE-1333](https://cwe.mitre.org/data/definitions/1333.html)) é o acrônimo de Regular Expression Denial of Service, o que pode ser traduzido em ataque de Negação de Serviço de Expressão Regular.
É um ataque que afeta a disponibilidade de um sistema, ele é viável devido a implementação de alguns algoritmos de análise de expressões regulares, 
que possuem uma complexidade algorítmica exponencial no pior caso. Sendo assim uma falha de ReDoS explorada com sucesso pode fazer com que um
sistema demore tempo demais para analisar uma expressão regular e consuma muito recurso de processamento, deixando o sistema lento ou até mesmo 
inviabilizando o serviço.

## Como funciona um ataque ReDoS?

Algumas implementações de algoritmos de interpretação de expressões regulares utilizam uma técnica chamada [backtracking](https://pt.wikipedia.org/wiki/Backtracking), que é bastante utilizada
em algoritmos de busca. Utilizando essa técnica o algoritmo tenta encontrar todos os caminhos possíveis para um problema, em um determinado passo da busca caseo ele não encontre nada, ele retorna ao estado de busca anterior e
tenta buscar por outro caminho, e continua fazendo esse processo até que todas as possibilidades tenham sido esgotadas. Abaixo temos alguns exemplos de expressões regulares que podem permitir um ataque ReDoS:

(a+)+

([a-zA-Z]+)*

^(([a-z])+.)+[A-Z]([a-z ])+$

^([a-zA-Z0-9])(([\-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.]{1}(([a-z]{2,3})|([a-z]{2,3}[.]{1}[a-z]{2,3}))$

O problemas de todas essas regex acima são a ambiguidade, utilizam grupos com repetição, e como dito anteriormente, dependendo do algorítimo que analise essas regex e do texto que elas forem aplicadas, o seu sistema pode sofrer uma negação de serviço. 

## Estou vulnerável a esse tipo de ataque?

Agora que já vimos um pouco de teoria vamos para a parte prática. Já vimos o que são regex, como são processadas, quais as vulnerabilidades que pode ser exploradas, e alguns exemplos mais triviais. Mas será que essa falha pode ser explorar em um ambiente real, de produção, será se meu sistema tá vulnerável a esse tipo de ataque? 

Uma rápida busca no CVE retornou o seguinte resultado:

![](./images/search_result_cve_redos.png)

97 ocorrências de falhas ReDoS reportadas, em diversos tipos de linguagens e bibliotecas.

E óbviamente essa lista não estã atualizada, pois a falha que irei utilizar como exemplo não está no resultado da busca. Veremos abaixo alguns softwares que tiveram falhas reportadas de ReDoS, mas não foram catalogadas com seu CVE, e, se você estiver utilizando  alguma versão que demonstrarei abaixo sugiro atualizar o seu ambiente o quanto antes:

* A biblioteca [validator.js](https://www.npmjs.com/package/validator) na versão 13.5.1 possui algumas falhas de ReDoS que foram prontamente [corrigida pelos seus mantenedores](https://github.com/validatorjs/validator.js/pull/1651), as validações [isEmail](https://github.com/validatorjs/validator.js/issues/1597) e [isHSL](https://github.com/validatorjs/validator.js/issues/1598) são as que estão vulneráveis, vamos tentar reproduzir isso localmente.

* A biblioteca jsPDF na versão [2.3.1](https://github.com/parallax/jsPDF/commit/d8bb3b39efcd129994f7a3b01b632164144ec43e) está vulnerável.

* A biblioteca is-email na versão [1.0.0](https://github.com/segmentio/is-email/commit/060ecedf345729f11ad857ccaf7a915ff6797739) está vulnerável.

* O ORM Sequelize na versão [6.6.4](https://github.com/sequelize/sequelize/commit/5fa695fd4f81faeae3528bf4aae519dfd1e5b1ae) está vulnerável, por que utiliza o validator.js para fazer a validação de dados em seus modelos.

Na verdade, todas as libs que utilizarem o validator.js na versão 13.5.1 estão possivelmente vulneráveis a esse ataque, caso utilizem alguma versão desatualizada desse pacote, a imagem abaixo mostra que existem atualmente 5381 pacotes dependentes do validator.js.

![](./images/dependents_packages_validatorjs.png)
## Como posso previnir esse ataque?

Usar uma lib de terceiros para fazer validação de regex. Se atentar ao criar regex que não possuam repetição e caminhos alternativos

Usar alguma linguagem que não possua backtracking.

Evite criar regex por conta própria, use bibliotecas de terceiros:

Algumas linguagens e algorítmos são imunes:

https://github.com/davisjam/vuln-regex-detector
https://github.com/davisjam/safe-regex

https://github.com/google/re2 - Lib que n usa backtrack
https://www.npmjs.com/package/re2

## Referências

https://en.wikipedia.org/wiki/Regular_expression
https://www.regular-expressions.info/catastrophic.html
https://levelup.gitconnected.com/the-regular-expression-denial-of-service-redos-cheat-sheet-a78d0ed7d865
https://lirantal.medium.com/node-js-pitfalls-how-a-regex-can-bring-your-system-down-cbf1dc6c4e02
https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS

https://discuss.rubyonrails.org/t/cve-2021-22880-possible-dos-vulnerability-in-active-record-postgresql-adapter/77129https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=REDoS