// styles.js
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  // container geral da tela
  container: {
    flex: 1,
    backgroundColor: '#F2FDF6',     // verde clarinho de fundo
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  // cartão branco onde fica todo o box
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    // sombra Android
    elevation: 4,
    // sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // borda verde fina no topo
    borderTopWidth: 4,
    borderTopColor: '#00B14F',
    padding: 20,
  },

  // topo com ícone e títulos
  boxTop: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#00B14F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
  },
  subtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },

  // seção de login (títulos)
  loginTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  loginDesc: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 16,
  },

  // campos de formulário
  boxMid: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#343A40',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
  },

  // linha com lembrar-me e esqueceu a senha
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#00B14F',
    borderRadius: 9,
    marginRight: 8,
  },
  rowText: {
    fontSize: 14,
    color: '#212529',
  },
  link: {
    fontSize: 14,
    color: '#00B14F',
  },

  // botão Entrar
  button: {
    backgroundColor: '#00B14F',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // rodapé
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#ADB5BD',
    marginTop: 8,
  },
});
