export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 md:px-8 md:py-32">
      <h1 className="font-heading text-3xl font-bold md:text-4xl">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : 30 septembre 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground md:text-base">
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">1. Qui sommes-nous</h2>
          <p className="mt-2">
            BEKON est un studio de design créatif et de personnalisation basé à Kinshasa, République
            Démocratique du Congo. Cette politique explique quelles données nous collectons sur ce
            site, pourquoi, et comment nous les protégeons.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">2. Données que nous collectons</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              <strong>Formulaire de devis :</strong> nom, adresse e-mail, téléphone, description de votre
              projet, et tout fichier que vous choisissez de joindre (images, logos, documents).
            </li>
            <li>
              <strong>Formulaire de contact :</strong> nom, adresse e-mail et le message que vous nous
              envoyez.
            </li>
            <li>
              <strong>Compte administrateur :</strong> identifiants de connexion, réservés à notre équipe
              pour gérer le contenu du site.
            </li>
          </ul>
          <p className="mt-2">
            Nous n'utilisons aucun cookie publicitaire ni outil de suivi tiers (type Google Analytics) sur
            ce site.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">3. Pourquoi nous les collectons</h2>
          <p className="mt-2">
            Ces informations nous servent uniquement à répondre à vos demandes de devis, à vous
            recontacter au sujet de votre projet, et à assurer le bon fonctionnement du site. Nous ne
            vendons ni ne partageons vos données avec des tiers à des fins commerciales.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">4. Conservation des données</h2>
          <p className="mt-2">
            Vos données sont conservées le temps nécessaire au traitement de votre demande, puis
            archivées ou supprimées selon nos besoins internes. Vous pouvez demander leur suppression à
            tout moment (voir section 6).
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">5. Sécurité</h2>
          <p className="mt-2">
            Vos données sont stockées sur des serveurs sécurisés (base de données hébergée, accès
            protégé par mot de passe). Nous prenons des mesures raisonnables pour empêcher tout accès
            non autorisé.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">6. Vos droits</h2>
          <p className="mt-2">
            Vous pouvez à tout moment nous demander quelles données nous détenons à votre sujet, les
            faire corriger, ou les faire supprimer, en nous écrivant à{" "}
            <a href="mailto:bergerkipasa0@gmail.com" className="text-electric hover:underline">
              bergerkipasa0@gmail.com
            </a>.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">7. Contact</h2>
          <p className="mt-2">
            Pour toute question concernant cette politique, contactez-nous à{" "}
            <a href="mailto:bergerkipasa0@gmail.com" className="text-electric hover:underline">
              bergerkipasa0@gmail.com
            </a>{" "}
            ou au +243 85 526 8657.
          </p>
        </section>
      </div>
    </div>
  );
}
