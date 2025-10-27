import { CarouselResponseType } from "../dtos/carousel.dto";
import { ProjectService } from "./project.service";
import { PerspectiveService } from "./perspective.service";

export class CarouselService {
    static async getAllCarouselOrder(): Promise<CarouselResponseType[]> {
        
        // 1. Buscando todos os dados
        const [allProjects, allPerspectives] = await Promise.all([
            ProjectService.findAll(),
            PerspectiveService.findAll(),
        ]);

        let response: CarouselResponseType[] = [];

        // 2. Mapeamento de Projetos
        const projectItems = allProjects
            .filter((p) => p.isCarousel === true) // Filtra apenas carrosséis
            .map((p) => ({ // Mapeia para o tipo CarouselResponseType
                _id: p._id,
                title: p.title,
                collection_type: "project" as const,
                banner: p.banner,
                isCarousel: p.isCarousel,
                orderCarousel: p.orderCarousel,
                extraURL: p.extraURL,
            }));

        // 3. Mapeamento de Perspectivas
        const perspectiveItems = allPerspectives
            .filter((p) => p.isCarousel === true) 
            .map((p) => ({ // Mapeia para o tipo CarouselResponseType
                _id: p._id,
                title: p.title,
                collection_type: "perspective" as const,
                banner: p.banner,
                isCarousel: p.isCarousel,
                orderCarousel: p.orderCarousel,
                extraURL: p.extraURL,
            }));
            
        // 4. Combina e ordena os resultados
        response = [...projectItems, ...perspectiveItems];

        // 5. Ordena pelo campo orderCarousel (Crescente: 1, 2, 3...)
        response.sort((a, b) => (a.orderCarousel ?? 0) - (b.orderCarousel ?? 0));
        
        return response;
    }
}