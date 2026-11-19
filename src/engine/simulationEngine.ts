import { 
  BaselineFlockConfig, 
  AlfalfaFieldConfig, 
  Cohort, 
  InventorySnapshot, 
  FinancialSnapshot, 
  StageFeasibilityReport,
  AnimalStage,
  CustomFinancialItem 
} from '../types/sheep';

/**
 * المحرك الحسابي المتكامل لمشاريع الأغنام
 * Technical, Biological & Financial Sheep Simulation Engine
 */
export class SheepSimulationEngine {
  private config: BaselineFlockConfig;
  private alfalfaConfig: AlfalfaFieldConfig;

  constructor(config: BaselineFlockConfig, alfalfaConfig: AlfalfaFieldConfig) {
    this.config = config;
    this.alfalfaConfig = alfalfaConfig;
  }

  /**
   * تشغيل المحاكاة واستخراج تقرير الموقف حتى أي يوم محدد (Target Day)
   * مع دعم البنود المالية المخصصة المضافة من قبل المستخدم
   */
  public simulateUntil(targetDay: number, customFinancialItems: CustomFinancialItem[] = []): StageFeasibilityReport {
    // 1. تثبيت المتغيرات التأسيسية
    // النعاج البالغة من بعد أول ولادة (التأسيسية)
    let parousMatureEwes = this.config.adultEwesCount;
    // فطائم نامية (من شهرين إلى 11 شهر)
    let growingFemaleWeaners = 0;
    // فطائم حاملة لأول مرة
    let firstParityPregnantHoggets = 0;
    
    // عدد الفحول العاملة
    let currentBreedingRams = this.config.breedingRamsCount;

    // سجلات الحركة التراكمية
    const baselineHeads = this.config.adultEwesCount + this.config.breedingRamsCount;
    let cumulativeBirths = 0;
    let cumulativeAbortedFetuses = 0;
    let cumulativePurchases = baselineHeads;
    let cumulativeMortality = 0;
    let cumulativeSold = 0;

    // سجلات المبيعات التراكمية
    let maleLambsSoldTotal = 0;
    let surplusFemalesSoldTotal = 0;
    let culledEwesSoldTotal = 0;
    let culledRamsSoldTotal = 0;

    const cohorts: Cohort[] = [];

    // 2. جدولة دورات التناسل والولادات (تتوسع دايناميكياً لأي عدد من السنوات)
    const cycles = this.generateBreedingCalendar(targetDay);

    let activeSucklingLambs = 0;
    let activeFatteningMales = 0;
    let activeFatteningFemales = 0;

    // تشغيل كل دورة إنتاجية
    for (let c = 0; c < cycles.length; c++) {
      const cycle = cycles[c];
      
      // إذا كان يوم التلقيح تجاوز اليوم المستهدف، نتوقف عن جدولة هذا الفوج
      if (cycle.matingDay > targetDay) break;

      // أ) ترقية الفطائم الحاملة لأول مرة من الدورة السابقة والتي أتمت الولادة لتصبح "نعاج بالغة من بعد أول ولادة"
      if (cycle.lambingDay <= targetDay) {
        parousMatureEwes += firstParityPregnantHoggets;
        firstParityPregnantHoggets = 0;
      }

      // ب) فحص الفطائم النامية التي بلغت عمر التلقيح (عمر 11-12 شهر) لتدخل كـ "فطائم حاملة لأول مرة"
      const eligibleHoggetsForMating = growingFemaleWeaners;
      growingFemaleWeaners = 0; // دخلت في التلقيح
      firstParityPregnantHoggets = eligibleHoggetsForMating;

      // إجمالي النعاج المشاركة في التلقيح (النعاج البالغة + الفطائم العشار لأول مرة)
      const totalMatingEwes = Math.min(
        this.config.maxHousingCapacity,
        parousMatureEwes + firstParityPregnantHoggets
      );

      // ضبط نسبة الفحول تلقائياً حسب نوع التلقيح (1:25 في الطبيعي، 1:10 في الهرموني CIDR)
      const requiredRamRatio = this.config.matingProtocol === 'hormonal_synchronized' ? 10 : 25;
      const neededRams = Math.max(1, Math.ceil(totalMatingEwes / requiredRamRatio));
      if (neededRams > currentBreedingRams) {
        const extraRamsBought = neededRams - currentBreedingRams;
        cumulativePurchases += extraRamsBought;
        currentBreedingRams = neededRams;
      }

      // إذا حل موعد ولادة هذا الفوج قبل أو عند اليوم المستهدف
      if (cycle.lambingDay <= targetDay) {
        // 3. حساب المواليد وتوزيع الجنس ونسبة الإجهاض
        const pregnantEwes = Math.round(totalMatingEwes * this.config.fertilityRate);
        const rawPotentialBirths = Math.round(pregnantEwes * this.config.prolificacyFactor);
        
        // احتساب الأجنة المجهضة
        const abortedFetuses = Math.round(rawPotentialBirths * this.config.abortionRate);
        cumulativeAbortedFetuses += abortedFetuses;

        // المواليد الحية القابلة للحياة
        const viableBirths = Math.max(0, rawPotentialBirths - abortedFetuses);
        
        // توزيع الجنس الدقيق (أعداد صحيحة)
        const malesCount = Math.round(viableBirths * 0.5);
        const femalesCount = viableBirths - malesCount;

        cumulativeBirths += viableBirths;

        // 4. احتساب النفوق في كل مرحلة عمرية
        // مرحلة الرضاعة (0-60 يوم)
        const sucklingDeadMales = Math.round(malesCount * this.config.preWeaningMortalityRate);
        const weanedMales = malesCount - sucklingDeadMales;
        
        const sucklingDeadFemales = Math.round(femalesCount * this.config.preWeaningMortalityRate);
        const weanedFemales = femalesCount - sucklingDeadFemales;

        const cohortSucklingMortality = sucklingDeadMales + sucklingDeadFemales;

        // مرحلة التسمين والفطام (60-180 يوم)
        const fatteningDeadMales = Math.round(weanedMales * this.config.postWeaningMortalityRate);
        const fattenedMalesReadyForSale = weanedMales - fatteningDeadMales;

        const fatteningDeadFemales = Math.round(weanedFemales * this.config.postWeaningMortalityRate);
        const healthyWeanedFemales = weanedFemales - fatteningDeadFemales;

        const cohortFatteningMortality = fatteningDeadMales + fatteningDeadFemales;

        // 5. سياسة الاحتفاظ بالإناث (بما فيها خيار الاحتفاظ بنصف الإناث 50%)
        let retainedFemales = 0;
        let surplusFemalesForSale = 0;

        const annualEweCulls = Math.round(parousMatureEwes * this.config.adultAnnualCullRate);
        const annualEweMortality = Math.round(parousMatureEwes * this.config.adultAnnualMortalityRate);

        if (this.config.femaleRetentionStrategy === 'retain_half') {
          // البند 6 المطلوب: الاحتفاظ بـ 50% من الإناث وإدخال الباقي في برنامج التسمين
          retainedFemales = Math.round(healthyWeanedFemales * 0.50);
          surplusFemalesForSale = healthyWeanedFemales - retainedFemales;
        } else if (this.config.femaleRetentionStrategy === 'growth_max') {
          // نمط التوسع الأقصى: الاحتفاظ بكل الإناث الصالحة حتى سقف الحظائر
          const capacityHeadroom = Math.max(0, this.config.maxHousingCapacity - (parousMatureEwes + firstParityPregnantHoggets));
          retainedFemales = Math.min(healthyWeanedFemales, capacityHeadroom);
          surplusFemalesForSale = healthyWeanedFemales - retainedFemales;
        } else if (this.config.femaleRetentionStrategy === 'steady_state') {
          // نمط الثبات: حجز الإحلال الإلزامي فقط لتغطية المستبعد والنافق
          const replacementNeed = annualEweCulls + annualEweMortality;
          retainedFemales = Math.min(healthyWeanedFemales, replacementNeed);
          surplusFemalesForSale = healthyWeanedFemales - retainedFemales;
        } else {
          // بيع تجاري
          retainedFemales = Math.min(healthyWeanedFemales, Math.round(annualEweCulls * 0.5));
          surplusFemalesForSale = healthyWeanedFemales - retainedFemales;
        }

        // 6. تتبع نمو وانتقال الفوج
        let stage: AnimalStage = 'suckling_lamb';
        if (targetDay < cycle.weaningDay) {
          // الفوج في مرحلة الرضاعة
          stage = 'suckling_lamb';
          activeSucklingLambs += (viableBirths - cohortSucklingMortality);
          cumulativeMortality += cohortSucklingMortality;
        } else if (targetDay < cycle.saleDay) {
          // الفوج في مرحلة التسمين/الفطام - فصل الذكور عن الإناث
          stage = 'growing_female_weaner';
          activeFatteningMales += fattenedMalesReadyForSale;
          activeFatteningFemales += surplusFemalesForSale;
          cumulativeMortality += (cohortSucklingMortality + cohortFatteningMortality);
          // الإناث المحتجزة تصبح فطائم نامية من عمر شهرين إلى 11 شهر
          growingFemaleWeaners += retainedFemales;
        } else {
          // الفوج اكتمل وتم بيع الذكور والإناث الفائضة
          stage = 'parous_mature_ewe';
          cumulativeMortality += (cohortSucklingMortality + cohortFatteningMortality);
          
          maleLambsSoldTotal += fattenedMalesReadyForSale;
          surplusFemalesSoldTotal += surplusFemalesForSale;
          cumulativeSold += (fattenedMalesReadyForSale + surplusFemalesForSale);

          // الإناث المحتجزة تضاف للفطائم النامية
          growingFemaleWeaners += retainedFemales;

          // تنفيذ استبعاد ونفوق النعاج البالغة السنوي
          cumulativeMortality += annualEweMortality;
          cumulativeSold += annualEweCulls;
          culledEwesSoldTotal += annualEweCulls;
          parousMatureEwes = Math.max(0, parousMatureEwes - annualEweCulls - annualEweMortality);
        }

        cohorts.push({
          id: `cohort-cycle-${c + 1}`,
          birthDay: cycle.lambingDay,
          cycleIndex: c + 1,
          initialBirths: viableBirths,
          initialMales: malesCount,
          initialFemales: femalesCount,
          abortedFetuses,
          sucklingDeadMales,
          weanedMales,
          fatteningDeadMales,
          marketSoldMales: fattenedMalesReadyForSale,
          sucklingDeadFemales,
          weanedFemales,
          fatteningDeadFemales,
          retainedReplacementFemales: retainedFemales,
          marketSoldFemales: surplusFemalesForSale,
          currentStage: stage,
        });
      }
    }

    // 1. استبدال الفحول كل سنتين إلزامي (عند اليوم 720، 1440، 2160، إلخ)
    // كل سنتين يتم بيع الفحول القديمة وشراء فحول جديدة بالكامل لمنع زواج الأقارب
    const ramCyclesPassed = Math.floor(targetDay / 720); // 720 يوماً = سنتين بالضبط
    if (ramCyclesPassed >= 1) {
      const totalRamsReplaced = currentBreedingRams * ramCyclesPassed;
      culledRamsSoldTotal = totalRamsReplaced;
      cumulativeSold += totalRamsReplaced;
      cumulativePurchases += totalRamsReplaced; // شراء فحول جديدة
    }

    // 7. إعداد تعداد الإناث الثلاثي وجرد القطيع مع فصل ذكور وإناث التسمين
    const matureEwesTotal = parousMatureEwes + firstParityPregnantHoggets + growingFemaleWeaners;
    const fatteningLambsTotal = activeFatteningMales + activeFatteningFemales;
    const totalLiveFlock = parousMatureEwes + firstParityPregnantHoggets + growingFemaleWeaners + currentBreedingRams + activeSucklingLambs + fatteningLambsTotal;

    // 8. مراجعة الأعداد ومطابقة الجرد قبل الاعتماد (المعادلة الصفرية)
    const expectedEndCount = cumulativePurchases + cumulativeBirths - cumulativeMortality - cumulativeSold;
    const discrepancy = totalLiveFlock - expectedEndCount;
    const isReconciled = Math.abs(discrepancy) === 0;

    const inventory: InventorySnapshot = {
      day: targetDay,
      periodLabel: `الموقف التشغيلي عند اليوم ${targetDay} (${Math.round(targetDay / 30)} شهراً)`,
      growingFemaleWeaners,
      firstParityPregnantHoggets,
      parousMatureEwes,
      matureEwesTotal,
      breedingRams: currentBreedingRams,
      sucklingLambs: activeSucklingLambs,
      fatteningMales: activeFatteningMales,
      fatteningFemales: activeFatteningFemales,
      fatteningLambsTotal,
      totalLiveFlock,
      configuredAbortionRate: this.config.abortionRate,
      cumulativeAbortedFetuses,
      cumulativeViableBirths: cumulativeBirths,
      cumulativeBaselineHeads: baselineHeads,
      cumulativeBirths,
      cumulativePurchases,
      cumulativeMortality,
      cumulativeSold,
      expectedEndCount,
      discrepancy,
      isReconciled,
    };

    // 9. موديول دريس الفصة المعمرة
    const alfalfaBalance = this.calculateAlfalfaBalance(targetDay, totalLiveFlock);

    // 10. الحسابات المالية التراكمية مع البنود المخصصة
    const financials = this.calculateFinancials(
      targetDay,
      inventory,
      maleLambsSoldTotal,
      surplusFemalesSoldTotal,
      culledEwesSoldTotal,
      culledRamsSoldTotal,
      alfalfaBalance,
      customFinancialItems
    );

    return {
      timestamp: new Date().toISOString(),
      day: targetDay,
      flockConfig: this.config,
      alfalfaConfig: this.alfalfaConfig,
      inventory,
      financials,
      alfalfaBalance,
      cohortsSummary: cohorts,
    };
  }

  /**
   * توليد تقويم التناسل وفق النظام السنوي أو المكثف 8 شهور لأي مدة زمنية (ديناميكية)
   */
  private generateBreedingCalendar(targetDay: number) {
    const calendar: Array<{
      matingDay: number;
      lambingDay: number;
      weaningDay: number;
      saleDay: number;
    }> = [];

    const cycleLengthDays = this.config.reproductionSystem === 'annual' ? 360 : 240;
    // دعم فترات مشاريع ممتدة حتى 10 سنوات
    const maxDay = Math.max(targetDay + 360, 3600);

    for (let day = 1; day <= maxDay; day += cycleLengthDays) {
      const matingDay = day;
      const lambingDay = matingDay + this.config.gestationDays; // + 150
      const weaningDay = lambingDay + this.config.lactationDays; // + 60
      const saleDay = weaningDay + 90; // تسمين 3 أشهر بعد الفطام

      calendar.push({ matingDay, lambingDay, weaningDay, saleDay });
    }

    return calendar;
  }

  /**
   * حساب ميزان دريس الفصة المعمرة
   */
  private calculateAlfalfaBalance(targetDay: number, currentFlockHeads: number) {
    if (!this.alfalfaConfig.enabled) {
      const totalHayConsumedTons = (currentFlockHeads * 1.2 * targetDay) / 1000;
      return {
        totalHayProducedTons: 0,
        totalHayConsumedTons,
        haySurplusTons: 0,
        hayDeficitTons: totalHayConsumedTons,
        selfSufficiencyPercent: 0,
      };
    }

    const years = targetDay / 360;
    const totalCuts = Math.floor(years * this.alfalfaConfig.cutsPerYear);
    const totalHayProducedTons = totalCuts * this.alfalfaConfig.areaHectares * this.alfalfaConfig.hayYieldPerCutTonsPerHa;

    // استهلاك القطيع للدريس بمتوسط 1.2 كجم/رأس/يوم + هامش الهدر 6%
    const totalHayConsumedTons = ((currentFlockHeads * 1.2 * (1 + this.alfalfaConfig.feedShrinkagePercent)) * targetDay) / 1000;

    const diff = totalHayProducedTons - totalHayConsumedTons;
    const haySurplusTons = Math.max(0, diff);
    const hayDeficitTons = Math.max(0, -diff);
    const selfSufficiencyPercent = totalHayConsumedTons > 0 
      ? Math.min(100, (totalHayProducedTons / totalHayConsumedTons) * 100)
      : 100;

    return {
      totalHayProducedTons: Math.round(totalHayProducedTons * 10) / 10,
      totalHayConsumedTons: Math.round(totalHayConsumedTons * 10) / 10,
      haySurplusTons: Math.round(haySurplusTons * 10) / 10,
      hayDeficitTons: Math.round(hayDeficitTons * 10) / 10,
      selfSufficiencyPercent: Math.round(selfSufficiencyPercent),
    };
  }

  /**
   * حساب القوائم المالية واقتصاديات الوحدة ودمج البنود المخصصة
   */
  private calculateFinancials(
    targetDay: number,
    inventory: InventorySnapshot,
    malesSold: number,
    femalesSold: number,
    culledEwesSold: number,
    culledRamsSold: number,
    alfalfa: { haySurplusTons: number; hayDeficitTons: number; totalHayConsumedTons: number },
    customItems: CustomFinancialItem[] = []
  ): FinancialSnapshot {
    // 1. الإيرادات الأساسية
    const maleLambsRevenue = malesSold * this.config.fattenedMaleSellingPrice;
    const surplusFemalesRevenue = femalesSold * this.config.surplusFemaleSellingPrice;
    const culledEwesRevenue = culledEwesSold * this.config.culledEweSellingPrice;
    const culledRamsRevenue = culledRamsSold * this.config.culledRamSellingPrice;
    
    const manureBags = Math.round(inventory.totalLiveFlock * (targetDay / 30) * 0.8);
    const manureRevenue = manureBags * this.config.manureBagSellingPrice;
    
    const woolRevenue = Math.round(inventory.matureEwesTotal * (targetDay / 360)) * this.config.woolPerHeadPrice;
    const surplusHayRevenue = alfalfa.haySurplusTons * this.alfalfaConfig.surplusHaySellingPricePerTon;

    // بنود الإيرادات المخصصة
    const customRevenueItems = customItems.filter(item => item.type === 'revenue');
    const customRevenueTotal = customRevenueItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

    const baseRevenue = maleLambsRevenue + surplusFemalesRevenue + culledEwesRevenue + culledRamsRevenue + manureRevenue + woolRevenue + surplusHayRevenue;
    const totalRevenue = baseRevenue + customRevenueTotal;

    // 2. التكاليف التشغيلية (OPEX)
    const concentrateFeedCost = Math.round(inventory.totalLiveFlock * 0.65 * 0.45 * targetDay);

    let forageHayCost = 0;
    if (this.alfalfaConfig.enabled) {
      const landOpex = (this.alfalfaConfig.annualOpexPerHa * this.alfalfaConfig.areaHectares * (targetDay / 360));
      const deficitPurchase = alfalfa.hayDeficitTons * this.alfalfaConfig.marketHayPricePerTon;
      forageHayCost = Math.round(landOpex + deficitPurchase);
    } else {
      forageHayCost = Math.round(alfalfa.totalHayConsumedTons * this.alfalfaConfig.marketHayPricePerTon);
    }

    const veterinaryHealthCost = Math.round(inventory.totalLiveFlock * 0.08 * targetDay);
    const laborCost = Math.round((Math.max(1, Math.ceil(inventory.totalLiveFlock / 200)) * 500) * (targetDay / 30));
    const utilitiesMaintenanceCost = Math.round(inventory.totalLiveFlock * 0.04 * targetDay);

    // بنود المصروفات المخصصة
    const customExpenseItems = customItems.filter(item => item.type === 'expense');
    const customExpenseTotal = customExpenseItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

    const baseOpex = concentrateFeedCost + forageHayCost + veterinaryHealthCost + laborCost + utilitiesMaintenanceCost;
    const totalOpex = baseOpex + customExpenseTotal;

    // 3. الاستثمارات الرأسمالية والإهلاك
    const biologicalInitialCapex = (this.config.adultEwesCount * this.config.ewePurchasePrice) + (this.config.breedingRamsCount * this.config.ramPurchasePrice);
    const alfalfaCapex = this.alfalfaConfig.enabled 
      ? this.alfalfaConfig.areaHectares * this.alfalfaConfig.establishmentCostPerHa 
      : 0;

    const eweDepreciationRate = 0.20; // 5 سنوات
    const alfalfaDepreciationRate = 0.20;
    const cumulativeDepreciation = Math.round(
      (biologicalInitialCapex * eweDepreciationRate * (targetDay / 360)) +
      (alfalfaCapex * alfalfaDepreciationRate * (targetDay / 360))
    );

    // 4. مؤشرات الربحية
    const ebitda = totalRevenue - totalOpex;
    const netProfit = ebitda - cumulativeDepreciation;

    // تقييم الأصول البيولوجية IAS 41
    const biologicalAssetValueIAS41 = 
      (inventory.parousMatureEwes * this.config.ewePurchasePrice) +
      (inventory.firstParityPregnantHoggets * (this.config.ewePurchasePrice * 0.95)) +
      (inventory.growingFemaleWeaners * (this.config.ewePurchasePrice * 0.75)) +
      (inventory.breedingRams * this.config.ramPurchasePrice) +
      (inventory.fatteningMales * (this.config.fattenedMaleSellingPrice * 0.75)) +
      (inventory.fatteningFemales * (this.config.surplusFemaleSellingPrice * 0.75)) +
      (inventory.sucklingLambs * 50);

    const estimatedTotalKgProduced = Math.max(1, (malesSold * 45) + (femalesSold * 38) + (inventory.fatteningMales * 30) + (inventory.fatteningFemales * 26));
    const costPerKgLiveWeight = Math.round((totalOpex / estimatedTotalKgProduced) * 100) / 100;

    const cashBalance = totalRevenue - totalOpex;

    return {
      day: targetDay,
      maleLambsRevenue,
      surplusFemalesRevenue,
      culledEwesRevenue,
      culledRamsRevenue,
      manureRevenue,
      woolRevenue,
      surplusHayRevenue,
      customRevenueItems,
      customRevenueTotal,
      totalRevenue,
      concentrateFeedCost,
      forageHayCost,
      veterinaryHealthCost,
      laborCost,
      utilitiesMaintenanceCost,
      customExpenseItems,
      customExpenseTotal,
      totalOpex,
      biologicalInitialCapex,
      alfalfaCapex,
      cumulativeDepreciation,
      ebitda,
      netProfit,
      biologicalAssetValueIAS41,
      costPerKgLiveWeight,
      cashBalance,
    };
  }
}
