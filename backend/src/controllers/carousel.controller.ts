import { Controller, Get, Route, Tags } from "tsoa";
import { CarrosselResponseType } from "../dtos/carousel.dto";
import { CarrosselService } from "../services/carousel.service";

@Route("carrossel")
@Tags("Carrossel")
export class CarrosselController extends Controller {
  /**
   * Retorna uma lista ordenada dos itens que estão no carrossel.
   * @summary
   */
  @Get("/")
  public async getAllCarouselOrder(): Promise<CarrosselResponseType[]> {
    return await CarrosselService.getAllCarouselOrder();
  }
}
