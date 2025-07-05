import React from 'react';
import { motion } from 'framer-motion';
import { 
  BriefcaseBusiness, 
  Users, 
  FileText, 
  Bell, 
  Lock, 
  TrendingUp,
  Shield,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const ModernAdminSections = () => {
  // Section Motivation & Features
  const MotivationFeaturesSection = () => (
    <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Welcome/Motivation Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/50 border border-slate-200/60 rounded-2xl p-8 overflow-hidden group hover:border-blue-300/50 transition-all duration-300"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.02] to-indigo-600/[0.04] opacity-60" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/8 to-cyan-400/8 rounded-full blur-2xl" />
        
        {/* Floating Icon */}
        <div className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50">
          <Shield className="text-blue-600 w-6 h-6" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <BriefcaseBusiness className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                Bienvenue, Administrateur
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Tableau de bord principal
              </p>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed mb-8 font-medium">
            Accédez à l'ensemble des outils d'administration pour gérer efficacement vos équipes, 
            offres d'emploi et optimiser vos processus de recrutement.
          </p>

          {/* Stats Highlight */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="text-emerald-600 w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Efficacité optimisée</p>
                  <p className="text-xs text-slate-500">Utilisation complète des fonctionnalités</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">+30%</p>
                <p className="text-xs text-slate-500">Performance recrutement</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Sparkles className="text-slate-600 w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              Fonctionnalités Clés
            </h3>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
            Mis à jour
          </span>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {[
            {
              icon: Users,
              title: "Gestion Utilisateurs",
              description: "Administration complète des comptes",
              color: "blue",
              bgColor: "bg-blue-50"
            },
            {
              icon: BriefcaseBusiness,
              title: "Offres d'Emploi",
              description: "Catalogue des postes disponibles",
              color: "indigo",
              bgColor: "bg-indigo-50"
            },
            {
              icon: FileText,
              title: "Analytiques",
              description: "Métriques et rapports détaillés",
              color: "emerald",
              bgColor: "bg-emerald-50"
            },
            {
              icon: Bell,
              title: "Notifications",
              description: "Alertes en temps réel",
              color: "amber",
              bgColor: "bg-amber-50"
            },
            {
              icon: Lock,
              title: "Sécurité",
              description: "Contrôle d'accès et protection",
              color: "red",
              bgColor: "bg-red-50"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className={`${feature.bgColor} rounded-xl p-4 border border-${feature.color}-200/30 hover:border-${feature.color}-300/50 transition-all duration-200 group cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-white rounded-lg shadow-sm border border-${feature.color}-200/30 group-hover:shadow-md transition-all duration-200`}>
                  <feature.icon className={`text-${feature.color}-600 w-4 h-4`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-${feature.color}-900 text-sm`}>
                    {feature.title}
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <ArrowRight className={`text-${feature.color}-400 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 group"
          onClick={() => window.location.href = '/Admin/Manage-users'}
        >
          <span>Explorer toutes les fonctionnalités</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </motion.button>
      </motion.div>
    </section>
  );

  // Section Motivation Additionnelle
  const AdditionalMotivationSection = () => (
    <section className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 overflow-hidden text-white"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-500/15 to-cyan-500/15 rounded-full blur-3xl opacity-40" />
        
        {/* Floating Elements */}
        <div className="absolute top-8 right-8 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white/90">Système Actif</span>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Left */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <TrendingUp className="text-white w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Maximisez Votre Impact
                </h2>
                <p className="text-blue-200 font-medium">
                  Tableau de bord intelligent
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Transformez votre processus de recrutement avec des outils d'analyse avancés 
              et une gestion centralisée. Prenez des décisions éclairées grâce à nos insights 
              en temps réel.
            </p>

            {/* Action Items */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Users className="text-emerald-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Équipe Optimisée</h4>
                  <p className="text-slate-400 text-sm">Gestion collaborative des talents</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FileText className="text-blue-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Insights Avancés</h4>
                  <p className="text-slate-400 text-sm">Analytics prédictives et reporting</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Démarrer l'analyse</span>
                <TrendingUp className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                Voir les statistiques
              </motion.button>
            </div>
          </div>

          {/* Stats Dashboard Right */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Performances en Direct
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Candidats</p>
                      <p className="text-2xl font-bold text-white">1,247</p>
                    </div>
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Users className="text-blue-400 w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="text-emerald-400 w-3 h-3" />
                    <span className="text-emerald-400 text-xs font-medium">+12%</span>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Offres</p>
                      <p className="text-2xl font-bold text-white">86</p>
                    </div>
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <BriefcaseBusiness className="text-purple-400 w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="text-emerald-400 w-3 h-3" />
                    <span className="text-emerald-400 text-xs font-medium">+8%</span>
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Taux de conversion</span>
                    <span className="text-white font-medium">78%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Satisfaction client</span>
                    <span className="text-white font-medium">92%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AdditionalMotivationSection />
      <MotivationFeaturesSection />
    </div>
  );
};

export default ModernAdminSections;
