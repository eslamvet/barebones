import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pet, BodyConditionLog, WeightLog } from '../../types';
import { supabase } from '@/utils/supabase';
import CustomTab from './CustomTab';
import WeightLogs from './WeightLogs';
import BodyCondition from './BodyCondition';
import VetVisits from './VetVisits';

type RootStackParamList = {
  SingleProfile: { id: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'SingleProfile'>;


function getThisMonthLogs(logs_bodycondition: BodyConditionLog[], logs_weight: WeightLog[]) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const latestBodyConditionLog = logs_bodycondition
    .filter(
      (log) =>
        new Date(log.date).getMonth() === currentMonth &&
        new Date(log.date).getFullYear() === currentYear
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const latestWeightLog = logs_weight
    .filter(
      (log) =>
        new Date(log.date).getMonth() === currentMonth &&
        new Date(log.date).getFullYear() === currentYear
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return { latestBodyConditionLog, latestWeightLog };
}

const PetCard = ({ pet }: { pet: Pet }) => (
  <View style={styles.card}>
    <Text style={styles.name}>{pet.name}</Text>
    <Text>Species: {pet.species}</Text>
    <Text>Age: {pet.age} years</Text>
  </View>
);

const HealthStatus = ({ pet }: { pet: Pet }) => (
  <View style={styles.healthStatus}>
    <Text style={styles.tableHeader}>Health Status</Text>
    <Text>Overall Health: {pet?.logs_weight.length > 3 ? 'Good' : 'Needs More Data'}</Text>
    <Text>Last Vet Visit: 2 months ago</Text>
  </View>
);

export const SingleProfileScreen: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [thisMonthLogs, setThisMonthLogs] = useState<{
    latestBodyConditionLog: BodyConditionLog | null;
    latestWeightLog: WeightLog | null;
  }>({
    latestBodyConditionLog: null,
    latestWeightLog: null,
  });
  const tabs = ['Weight Logs', 'Body Condition', 'Vet Visits'];
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const { data, error } = await supabase.from('pets').select<string, Pet>(`*,logs_weight:weight_logs(*),logs_bodycondition:body_condition_logs(*),logs_vet_visits:vet_visit_logs(*)`).eq('id', id).maybeSingle();
        if (error) {
          error.message
        } else setPet(data);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  useEffect(() => {
    if (pet) {
      setThisMonthLogs(getThisMonthLogs(pet.logs_bodycondition, pet.logs_weight));
    }
  }, [pet]);

  if (loading) {
    return <ActivityIndicator style={styles.loader} />;
  }

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text>Pet not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentWrapper}>
        <PetCard pet={pet} />
        <View style={styles.monthSummary}>
          <Text style={styles.tableHeader}>This Month's Summary</Text>
          <Text>
            Latest Weight: {thisMonthLogs.latestWeightLog?.weight || 'No data'} kg
          </Text>
          <Text>
            Body Condition: {thisMonthLogs.latestBodyConditionLog?.body_condition || 'No data'}
          </Text>
        </View>
        <HealthStatus pet={pet} />
        <CustomTab tabs={tabs} onTabPress={setActiveTab} />
        <ScrollView scrollEnabled={false} horizontal contentContainerStyle={styles.tabContentWrapper}>
          {
            activeTab == 0 ? <WeightLogs weightLogs={pet.logs_weight} /> : activeTab == 1 ? <BodyCondition bodyConditionLogs={pet.logs_bodycondition} /> : <VetVisits vetVisitLogs={pet.logs_vet_visits!} />
          }
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  contentWrapper:{
    flexDirection: 'column',
    gap: 16
  },
  tabContentWrapper:{
    width:'100%',
    padding: 10
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  table: {
    marginTop: 16,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  monthSummary: {
    padding: 16,
    backgroundColor: '#e6f3ff',
    borderRadius: 8,
  },
  healthStatus: {
    padding: 16,
    backgroundColor: '#f0fff0',
    borderRadius: 8,
  },
}); 