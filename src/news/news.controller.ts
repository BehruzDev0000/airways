import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
} from "@nestjs/common";
import { NewsService } from "./news.service";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import type { Multer } from "multer";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import type { Request } from "express";
import { existsSync, mkdirSync } from "fs";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";

@ApiTags("news")
@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  private static storage = diskStorage({
    destination: (req, file, callback) => {
      const uploadPath = join(__dirname, "..", "..", "uploads");
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      callback(null, uniqueSuffix + extname(file.originalname));
    },
  });

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin')
  @ApiOperation({ summary: "Yangi yangilik qo‘shish" })
  @ApiResponse({ status: 201, description: "Yangilik muvaffaqiyatli yaratildi" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        content: { type: "string" },
        image: { type: "string", format: "binary" },
      },
    },
  })
  @UseInterceptors(FileInterceptor("image", { storage: NewsController.storage }))
  async create(
    @Req() req: Request,
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFile() file: Multer.File,
  ) {
    const host = `${req.protocol}://${req.get("host")}`;
    const imageUrl = file ? `${host}/uploads/${file.filename}` : undefined;
    return this.newsService.create(createNewsDto, imageUrl);
  }

  @Get()
  @ApiOperation({ summary: "Get all news" })
  findAll() {
    return this.newsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get news by ID" })
  @ApiParam({ name: "id", type: Number })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.newsService.findOne(id);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin')
  @ApiOperation({ summary: "Update news" })
  @ApiParam({ name: "id", type: Number })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        content: { type: "string" },
        image: { type: "string", format: "binary" },
      },
    },
  })
  @UseInterceptors(FileInterceptor("image", { storage: NewsController.storage }))
  async update(
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFile() file?: Multer.File,
  ) {
    const host = `${req.protocol}://${req.get("host")}`;
    const imageUrl = file ? `${host}/uploads/${file.filename}` : undefined;
    return this.newsService.update(id, updateNewsDto, imageUrl);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin')
  @ApiOperation({ summary: "Yangilikni o‘chirish" })
  @ApiParam({ name: "id", type: Number })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.newsService.remove(id);
  }
}

