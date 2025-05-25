import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#2ecc71', // verde do contorno
    borderRadius: 30,
    padding: 5,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: 'white',
  },
  tabText: {
    color: '#ffffff88', // texto esverdeado translúcido
    fontWeight: '600',
  },
  activeTabText: {
    color: '#2ecc71', // verde principal no texto ativo
  },
});
