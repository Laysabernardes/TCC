import { CarrosselResponseType } from "../dtos/carousel.dto";
import { ProjectService } from "./project.service";
import { PerspectiveService } from "./perspective.service";

export class CarrosselService {
  static async getAllCarouselOrder(): Promise<CarrosselResponseType[]> {
    let response: CarrosselResponseType[] = [];
    const allProjects = await ProjectService.findAll();
    allProjects.filter((p) => {
      if (p.isCarrossel === true) {
        response.push({
          _id: p._id,
          title: p.title,
          collection_type: "project",
          banner: p.banner,
          isCarrossel: p.isCarrossel,
          orderCarrossel: p.orderCarrossel,
          extraURL: p.extraURL,
        });
      }
    });

    const allPerspectives = await PerspectiveService.findAll();
    allPerspectives.filter((p) => {
      if (p.isCarrossel === true) {
        response.push({
          _id: p._id,
          title: p.title,
          collection_type: "perspective",
          banner: p.banner,
          isCarrossel: p.isCarrossel,
          orderCarrossel: p.orderCarrossel,
          extraURL: p.extraURL,
        });
      }
    });

    return response;
  }
}
