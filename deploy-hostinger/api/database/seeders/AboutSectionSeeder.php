<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AboutSection;

class AboutSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sections = [
            [
                'section_id' => 'qui-sommes-nous',
                'title' => 'Qui sommes-nous ?',
                'content' => 'Nous sommes une organisation de droit congolais basée à Kolwezi, chef-lieu de la Province du Lualaba. Le CAJJ est constitué de juristes et d\'avocats volontaires engagés pour la promotion et la protection des droits humains et de l\'environnement associés à l\'exploitation des ressources naturelles (mines, forêts, hydrocarbures, énergies et eau).',
            ],
            [
                'section_id' => 'vision',
                'title' => 'Notre vision',
                'content' => 'Nous prônons un monde dans lequel chaque être humain — homme, femme, enfant — jouit de ses droits en toute égalité et en toute circonstance.',
            ],
            [
                'section_id' => 'mission',
                'title' => 'Notre mission',
                'content' => 'Notre mission est de contribuer à la promotion et à la protection des droits humains en général et des droits de l\'environnement associés à l\'exploitation des ressources naturelles (mines, forêt, hydrocarbures, énergies et eau) en particulier. À cette fin, le CAJJ veille à l\'application des normes juridiques nationales et des instruments juridiques régionaux et internationaux relatifs aux droits humains dûment ratifiés par la RD Congo.',
            ],
            [
                'section_id' => 'devise',
                'title' => 'Notre devise',
                'content' => 'Étant une organisation locale œuvrant pour la promotion et la protection des droits humains, notre devise est : assister, former et informer.',
            ],
            [
                'section_id' => 'valeurs',
                'title' => 'Nos valeurs',
                'content' => 'Nos grandes valeurs humanitaires sont inspirées par notre mission et notre éthique de défenseurs des droits humains : dignité, égalité, engagement, respect, liberté, solidarité, autonomie, intégrité, compassion, confidentialité.',
            ],
        ];
        
        foreach ($sections as $section) {
            AboutSection::updateOrCreate(
                ['section_id' => $section['section_id']],
                $section
            );
        }
    }
}
