import type { IContentBlock, IImageBlock } from '../FormPerspective/perspective.types';
import styles from './ContentBlockRenderer.module.css';

// --- LÓGICA DE AGRUPAMENTO DE IMAGENS ---
// Interface para representar um grupo de imagens
interface IImageGroup {
  type: 'image_group';
  images: IImageBlock[];
}

// O tipo de bloco que vamos renderizar pode ser um bloco normal ou um grupo de imagens
type RenderBlock = IContentBlock | IImageGroup;

// Função que pré-processa os blocos para agrupar imagens consecutivas
function groupConsecutiveImages(blocks: IContentBlock[]): RenderBlock[] {
  const groupedBlocks: RenderBlock[] = [];
  let i = 0;
  while (i < blocks.length) {
    const currentBlock = blocks[i];
    // Se o bloco atual e o próximo são imagens, cria um grupo
    if (currentBlock.type === 'image' && blocks[i + 1]?.type === 'image') {
      const imageGroup: IImageGroup = { type: 'image_group', images: [currentBlock] };
      let j = i + 1;
      // Continua adicionando imagens ao grupo enquanto forem do tipo 'image'
      while (j < blocks.length && blocks[j].type === 'image') {
        imageGroup.images.push(blocks[j] as IImageBlock);
        j++;
      }
      groupedBlocks.push(imageGroup);
      i = j; // Pula o índice do loop principal para depois do grupo
    } else {
      // Caso contrário, apenas adiciona o bloco individual
      groupedBlocks.push(currentBlock);
      i++;
    }
  }
  return groupedBlocks;
}

// --- COMPONENTE PRINCIPAL ---
interface ContentBlockRendererProps {
  blocks: IContentBlock[];
}

export function ContentBlockRenderer({ blocks }: ContentBlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return <p>Conteúdo não disponível.</p>;
  }

  // Pré-processa os blocos antes de renderizar
  const blocksToRender = groupConsecutiveImages(blocks);

  return (
    <div className={styles.contentWrapper}>
      {blocksToRender.map((block, index) => {
        const key = `block-${index}`; // Chave única para cada bloco

        switch (block.type) {
          case 'title':
            return <h1 key={key} className={styles.title}>{block.content}</h1>;
          case 'text':
            return <p key={key} className={styles.text}>{block.content}</p>;
          
          case 'highlight':
            return <blockquote key={key} className={styles.highlight}>{block.content}</blockquote>;

          case 'image': // Renderiza uma imagem que está sozinha
            return (
              <figure key={key} className={styles.singleImage}>
                <img src={block.imageUrl} alt={block.caption} />
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            );

          case 'image_group': // Renderiza um grupo de imagens lado a lado
            return (
              <div key={key} className={styles.imageGroup}>
                {block.images.map((img, imgIndex) => (
                  <figure key={imgIndex}>
                    <img src={img.imageUrl} alt={img.caption} />
                    {img.caption && <figcaption>{img.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}