import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, FlatList, ActivityIndicator, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEvents } from '../hooks/useEvents';

export default function EventsListScreen() {
  const [search, setSearch] = useState('');
  const nav = useNavigation<any>();
  const { query, deleteMut } = useEvents({ search: search || undefined, limit: 200 });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Filtros */}
      <View style={{ padding: 12, gap: 8, backgroundColor: '#f6f6f6' }}>
        <TextInput
          placeholder="Buscar por pessoa"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => query.refetch()}
          style={{ backgroundColor: '#fff', padding: 10, borderRadius: 8 }}
        />
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Button title="Buscar" onPress={() => query.refetch()} />
          <Button title="Limpar" onPress={() => { setSearch(''); query.refetch(); }} />
          <Button title="Novo" onPress={() => nav.navigate('EventForm', { mode: 'create' })} />
        </View>
      </View>

      {/* Conteúdo */}
      {query.isLoading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : query.isError ? (
        <View style={{ padding: 16 }}>
          <Text style={{ color: 'crimson', marginBottom: 8 }}>Erro: {(query.error as Error).message}</Text>
          <Button title="Tentar novamente" onPress={() => query.refetch()} />
        </View>
      ) : (
        <FlatList
          data={query.data}
          keyExtractor={(item) => String(item.id)}
          refreshing={query.isRefetching}
          onRefresh={() => query.refetch()}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <View style={{ padding: 12, borderRadius: 12, backgroundColor: '#fff', marginVertical: 6, shadowOpacity: 0.08, shadowRadius: 4 }}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.pessoa}</Text>
              <Text>Status: {item.status} • Primeira vez: {item.primeira_vez ? 'sim' : 'não'}</Text>
              <Text>{new Date(item.event_time).toLocaleString()}</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                <Button title="Editar" onPress={() => nav.navigate('EventForm', { mode: 'edit', item })} />
                <Button
                  title="Excluir"
                  color="#c62828"
                  onPress={() =>
                    Alert.alert('Confirmar', 'Excluir este registro?', [
                      { text: 'Cancelar', style: 'cancel' },
                      {
                        text: 'Excluir',
                        style: 'destructive',
                        onPress: () =>
                          deleteMut.mutate(item.id, {
                            onError: (e: any) => Alert.alert('Erro', String(e?.message || e)),
                            onSuccess: () => query.refetch(),
                          }),
                      },
                    ])
                  }
                />
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24 }}>Nenhum registro.</Text>}
        />
      )}
    </SafeAreaView>
  );
}
