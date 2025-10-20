import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Button, SafeAreaView, Alert } from 'react-native';
import { z } from 'zod';
import { useEvents } from '../hooks/useEvents';
import type { AccessEvent } from '../types';
import { useNavigation, useRoute } from '@react-navigation/native';

const schema = z.object({
  pessoa: z.string().min(1, 'Pessoa é obrigatório'),
  status: z.enum(['Aprovado', 'Negado']),
  primeira_vez: z.boolean(),
});

type RouteParams = { mode: 'create' } | { mode: 'edit'; item: AccessEvent };

export default function EventFormScreen() {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const params = route.params as RouteParams;
  const isEdit = params?.mode === 'edit';

  const [pessoa, setPessoa] = useState(isEdit ? params.item.pessoa : '');
  const [status, setStatus] = useState<'Aprovado' | 'Negado'>(
    isEdit ? (params.item.status as any) : 'Aprovado'
  );
  const [primeira, setPrimeira] = useState<boolean>(isEdit ? !!params.item.primeira_vez : true);

  const { createMut, updateMut } = useEvents({});

  function salvar() {
    const parse = schema.safeParse({ pessoa, status, primeira_vez: primeira });
    if (!parse.success) {
      const msg = parse.error.errors.map(e => e.message).join('\n');
      Alert.alert('Validação', msg);
      return;
    }

    if (isEdit) {
      updateMut.mutate(
        { id: params.item.id, patch: { pessoa, status, primeira_vez: primeira } },
        {
          onSuccess: () => {
            Alert.alert('Sucesso', 'Registro atualizado');
            nav.goBack();
          },
          onError: (e: any) => Alert.alert('Erro', String(e?.message || e)),
        }
      );
    } else {
      createMut.mutate(
        { pessoa, status, primeira_vez: primeira },
        {
          onSuccess: () => {
            Alert.alert('Sucesso', 'Registro criado');
            nav.goBack();
          },
          onError: (e: any) => Alert.alert('Erro', String(e?.message || e)),
        }
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
        {isEdit ? 'Editar evento' : 'Novo evento'}
      </Text>

      <Text style={{ marginTop: 8 }}>Pessoa</Text>
      <TextInput
        value={pessoa}
        onChangeText={setPessoa}
        placeholder="Nome"
        style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
      />

      <Text style={{ marginTop: 12 }}>Status</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
        <Button title={status === 'Aprovado' ? 'Aprovado ✅' : 'Aprovado'} onPress={() => setStatus('Aprovado')} />
        <Button title={status === 'Negado' ? 'Negado ✅' : 'Negado'} onPress={() => setStatus('Negado')} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 8 }}>
        <Text>Primeira vez</Text>
        <Switch value={primeira} onValueChange={setPrimeira} />
      </View>

      <Button title={isEdit ? 'Salvar alterações' : 'Criar'} onPress={salvar} />
    </SafeAreaView>
  );
}
