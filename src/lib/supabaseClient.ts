import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase.local';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * حفظ تقرير جرد أو دراسة في قاعدة بيانات Supabase
 */
export async function saveSnapshotToSupabase(snapshotData: any) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn('Supabase URL not configured, skipping cloud persistence');
      return { success: false, message: 'Supabase credentials missing' };
    }
    const { data, error } = await supabase
      .from('flock_snapshots')
      .insert([
        {
          day: snapshotData.day,
          total_flock: snapshotData.inventory.totalLiveFlock,
          mature_ewes: snapshotData.inventory.matureEwes,
          rams: snapshotData.inventory.breedingRams,
          discrepancy: snapshotData.inventory.discrepancy,
          is_reconciled: snapshotData.inventory.isReconciled,
          total_revenue: snapshotData.financials.totalRevenue,
          total_opex: snapshotData.financials.totalOpex,
          net_profit: snapshotData.financials.netProfit,
          data: snapshotData,
        }
      ]);

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error('Error saving to Supabase:', err.message);
    return { success: false, error: err.message };
  }
}
