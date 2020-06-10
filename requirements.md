# Tabelas
users: name, email, password_hash, admin, timestamps
recipients: street, number, complement, state, city, zip_code


# Requisitos funcionais
[] precisa ter autenticação jwt
[] necessita de ter usuarios admin
[] validaçao dos dados 


# Requisitos nao funcionais


# Regras de negocio
=> O destinatário não pode se autenticar no sistema, ou seja, não possui senha.
=> O cadastro de destinatários só pode ser feito por administradores autenticados na aplicação.