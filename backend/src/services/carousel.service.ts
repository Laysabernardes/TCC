import { CarouselResponseType } from "../dtos/carousel.dto";
import { ProjectService } from "./project.service";
import { PerspectiveService } from "./perspective.service";

export class CarouselService {
  static async getAllCarouselOrder(): Promise<CarouselResponseType[]> {
    let response: CarouselResponseType[] = [];
    const allProjects = await ProjectService.findAll();
    allProjects.filter((p) => {
      if (p.isCarousel === true) {
        response.push({
          _id: p._id,
          title: p.title,
          collection_type: "project",
          banner: p.banner,
          isCarousel: p.isCarousel,
          orderCarousel: p.orderCarousel,
          extraURL: p.extraURL,
        });
      }
    });

    const allPerspectives = await PerspectiveService.findAll();
    allPerspectives.filter((p) => {
      if (p.isCarousel === true) {
        response.push({
          _id: p._id,
          title: p.title,
          collection_type: "perspective",
          banner: p.banner,
          isCarousel: p.isCarousel,
          orderCarousel: p.orderCarousel,
          extraURL: p.extraURL,
        });
      }
    });

    return response;
  }
}
