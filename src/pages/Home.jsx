import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext.jsx";

function Home() {
  const { t } = useLang();

  return (
    <div>
      {/* Hero */}
      <div className="grid md:grid-cols-2 gap-10 items-center py-6">
        <div className="animate-fade-up">
          <p className="text-xs tracking-[0.2em] text-gold uppercase mb-4">
            Bac Sciences · Tunisie
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight mb-5">
            {t("welcome")}
          </h1>
          <p className="text-stone-muted leading-relaxed mb-8 max-w-md">
            {t("heroText")}
          </p>
          <div className="flex gap-3">
            <Link
              to="/ressources"
              className="px-6 py-3 bg-charcoal text-cream rounded-md text-sm hover:bg-indigo-blue transition-colors"
            >
              {t("seeResources")}
            </Link>
            <Link
              to="/livres"
              className="px-6 py-3 border border-stone-light text-charcoal rounded-md text-sm hover:border-gold transition-colors"
            >
              {t("seeBooks")}
            </Link>
          </div>
        </div>

        {/* Visuel animé — une seule fois au chargement */}
        <div
          className="rounded-xl aspect-[4/5] md:aspect-square flex items-center justify-center animate-fade-up"
          style={{
            animationDelay: "0.15s",
            background: "linear-gradient(160deg, #3730A3, #1E3A8A 75%)",
          }}
        >
          <svg viewBox="0 0 200 140" className="w-2/3" fill="none">
            <path
              d="M100 20 L100 70 M100 20 L40 55 Q20 65 15 85 Q45 75 65 65 L100 70 M100 20 L160 55 Q180 65 185 85 Q155 75 135 65 L100 70 M100 70 L90 115 M100 70 L110 115"
              stroke="#B8935A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-draw-bird"
            />
          </svg>
        </div>
      </div>

      {/* Réassurance */}
      <div className="grid sm:grid-cols-3 gap-4 mt-16 animate-fade-up" style={{ animationDelay: "0.3s" }}>
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <p className="text-2xl mb-2">📘</p>
          <p className="font-serif text-charcoal mb-1">Ressources gratuites</p>
          <p className="text-sm text-stone-muted">Cours, séries et devoirs classés par matière, téléchargeables librement.</p>
        </div>
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <p className="text-2xl mb-2">📦</p>
          <p className="font-serif text-charcoal mb-1">Livres à commander</p>
          <p className="text-sm text-stone-muted">Un catalogue sélectionné, commande simple, paiement à la livraison.</p>
        </div>
        <div className="bg-white border border-stone-light rounded-lg p-6">
          <p className="text-2xl mb-2">🌍</p>
          <p className="font-serif text-charcoal mb-1">Bilingue AR / FR</p>
          <p className="text-sm text-stone-muted">Un contenu accessible dans les deux langues, avec support RTL.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;