<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Action;

class ActionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $actions = [
            [
                'action_id' => 'nos-actions',
                'title' => 'Nos actions',
                'description' => 'Nous accompagnons les justiciables à chaque étape, de la première écoute jusqu\'au plaidoyer institutionnel, pour garantir la défense effective de leurs droits.',
                'order' => 0,
            ],
            [
                'action_id' => 'consultation-gratuite',
                'title' => 'Consultation gratuite (écoute et orientation)',
                'description' => 'Offrir les premières informations juridiques, répondre aux questions légales urgentes et orienter les personnes vers la bonne juridiction ou le bon professionnel (avocat, tribunal, médiation, etc.).',
                'order' => 1,
            ],
            [
                'action_id' => 'accompagnement-juridique',
                'title' => 'Accompagnement juridique',
                'description' => 'Assister les requérant·e·s dans les démarches extrajudiciaires : rédaction de contrats, plaintes, testaments, procédures de conciliation ou accords amiables.',
                'order' => 2,
            ],
            [
                'action_id' => 'accompagnement-judiciaire',
                'title' => 'Accompagnement judiciaire',
                'description' => 'Mettre à disposition des avocat·e·s-conseils pour représenter les victimes devant les juridictions, plaider, conclure et solliciter réparations ou dommages-intérêts.',
                'order' => 3,
            ],
            [
                'action_id' => 'formation',
                'title' => 'Formation',
                'description' => 'Organiser des sessions de renforcement de capacités, ateliers, séminaires et conférences pour doter les communautés des connaissances nécessaires à l\'exercice de leurs droits.',
                'order' => 4,
            ],
            [
                'action_id' => 'sensibilisation',
                'title' => 'Sensibilisation',
                'description' => 'Vulgariser les instruments juridiques nationaux, régionaux et internationaux via des brochures, dépliants, et des émissions radio/télé pour faire connaître les droits fondamentaux.',
                'order' => 5,
            ],
            [
                'action_id' => 'monitoring',
                'title' => 'Monitoring',
                'description' => 'Assurer le suivi, la recherche et la documentation des violations des droits humains, y compris des visites dans les centres pénitentiaires pour identifier abus de pouvoir et détentions illégales.',
                'order' => 6,
            ],
            [
                'action_id' => 'plaidoyer',
                'title' => 'Plaidoyer',
                'description' => 'Interpeller les institutions locales, nationales et internationales afin d\'obtenir des réformes légales ou pratiques garantissant une meilleure protection des droits humains.',
                'order' => 7,
            ],
            [
                'action_id' => 'bonne-gouvernance',
                'title' => 'Bonne gouvernance',
                'description' => 'Promouvoir la transparence et la redevabilité, spécialement dans le secteur minier, pour une gestion responsable des ressources naturelles.',
                'order' => 8,
            ],
        ];

        foreach ($actions as $action) {
            Action::firstOrCreate(['action_id' => $action['action_id']], $action);
        }
    }
}
