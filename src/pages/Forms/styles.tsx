import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecfdf5',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    gap: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  iconWrapper: {
    backgroundColor: '#22c55e',
    padding: 6,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  label: {
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoBox: {
    backgroundColor: '#ecfdf5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#16a34a',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});