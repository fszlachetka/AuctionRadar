package com.project.act.Controllers;

import com.project.act.DTOs.MieszkanieCreateDTO;
import com.project.act.DTOs.MieszkanieFilterDTO;
import com.project.act.DTOs.MieszkanieGetDTO;
import com.project.act.Services.MieszkanieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mieszkania")
public class MieszkanieController {

    private final MieszkanieService mieszkanieService;

    public MieszkanieController(MieszkanieService mieszkanieService) {
        this.mieszkanieService = mieszkanieService;
        System.out.println("MIESZKANIA rest controller start");
    }

    @GetMapping
    public ResponseEntity<List<MieszkanieGetDTO>> getAllMieszkania() {
        return ResponseEntity.ok(mieszkanieService.getAllMieszkanie());
    }

    @PostMapping("/filter")
    public ResponseEntity<List<MieszkanieGetDTO>> filterAndGetMieszkania(@RequestBody MieszkanieFilterDTO dto){
        List<MieszkanieGetDTO> result = mieszkanieService.filterAndGetMieszkania(dto);

        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<MieszkanieGetDTO> createMieszkanie(@RequestBody MieszkanieCreateDTO dto) {
        MieszkanieGetDTO saved = mieszkanieService.createMieszkanie(dto);
        return ResponseEntity.ok(saved);
    }
}

