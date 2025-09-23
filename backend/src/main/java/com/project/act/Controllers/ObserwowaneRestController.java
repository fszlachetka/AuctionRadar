package com.project.act.Controllers;

import com.project.act.DTOs.ObserwowaneDTO;
import com.project.act.Services.ObserwowaneService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/obserwowane")
public class ObserwowaneRestController {

    private final ObserwowaneService obserwowaneService;

    public ObserwowaneRestController(ObserwowaneService obserwowaneService) {
        this.obserwowaneService = obserwowaneService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addToFavorites(@RequestBody ObserwowaneDTO dto) {
        obserwowaneService.addToFavorites(dto);
        return ResponseEntity.ok("Added to favorites");
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromFavorites(@RequestBody ObserwowaneDTO dto) {
        obserwowaneService.removeFromFavorites(dto);
        return ResponseEntity.ok("Removed from favorites");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ObserwowaneDTO>> getFavorites(@PathVariable Long userId) {
        List<ObserwowaneDTO> favorites = obserwowaneService.getFavorites(userId);
        return ResponseEntity.ok(favorites);
    }
}