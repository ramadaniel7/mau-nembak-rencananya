/**
 * Bible verses — Indonesian "Terjemahan Baru (TB)", © Lembaga Alkitab Indonesia.
 * Please double-check each excerpt against your own Alkitab before publishing.
 */
export const BIBLE_TRANSLATION = 'Alkitab Terjemahan Baru (TB) © LAI';

export interface Verse {
  reference: string;
  theme: string;
  text: string;
  reflection: string;
}

export const VERSES: Verse[] = [
  {
    reference: '1 Korintus 13:4–7',
    theme: 'Love',
    text:
      'Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. ' +
      'Ia tidak melakukan yang tidak sopan dan tidak mencari keuntungan diri sendiri. Ia tidak pemarah dan tidak menyimpan kesalahan orang lain. ' +
      'Ia tidak bersukacita karena ketidakadilan, tetapi karena kebenaran. ' +
      'Ia menutupi segala sesuatu, percaya segala sesuatu, mengharapkan segala sesuatu, sabar menanggung segala sesuatu.',
    reflection:
      'This is the kind of love I want to learn: patient, honest, and gentle. No rushing, no pressure, only sincerity.',
  },
  {
    reference: '1 Yohanes 4:19',
    theme: 'Love comes from God',
    text: 'Kita mengasihi, karena Allah lebih dahulu mengasihi kita.',
    reflection:
      'Whatever I feel, I know love begins with being loved first. I am thankful for that, and I want to love with a grateful heart.',
  },
  {
    reference: 'Yohanes 15:11',
    theme: 'Joy',
    text: 'Hal-hal ini Kukatakan kepadamu, supaya sukacita-Ku ada di dalam kamu dan sukacitamu menjadi penuh.',
    reflection:
      'I hope you always have a joy that is full. The quiet kind that stays even on ordinary days.',
  },
  {
    reference: 'Pengkhotbah 3:11',
    theme: 'Life',
    text: 'Ia membuat segala sesuatu indah pada waktunya, bahkan Ia memberikan kekekalan dalam hati mereka.',
    reflection:
      'I am not rushing anything. Some beautiful things simply have their own time, and I am happy to wait for them.',
  },
  {
    reference: 'Mazmur 139:14',
    theme: "God's creation",
    text: 'Aku bersyukur kepada-Mu oleh karena kejadianku dahsyat dan ajaib; ajaib apa yang Kaulakukan, dan jiwaku benar-benar menyadarinya.',
    reflection:
      'You are wonderfully made, just as you are. Getting to see that up close is something I am genuinely grateful for.',
  },
];
