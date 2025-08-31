package com.project.act.Controllers;

import com.project.act.DTOs.MieszkanieCreateDTO;
import com.project.act.DTOs.MieszkanieFilterDTO;
import com.project.act.DTOs.MieszkanieGetDTO;
import com.project.act.Services.MieszkanieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/mieszkania")
public class MieszkanieRestController {

    private final MieszkanieService mieszkanieService;

    public MieszkanieRestController(MieszkanieService mieszkanieService) {
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

    @PostMapping("create")
    public ResponseEntity<MieszkanieGetDTO> createMieszkanie(@RequestBody MieszkanieCreateDTO dto) {
        MieszkanieGetDTO saved = mieszkanieService.createMieszkanie(dto);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("create/batch")
    public ResponseEntity<List<MieszkanieGetDTO>> createMieszkanie(@RequestBody List<MieszkanieCreateDTO> dtos){
        List<MieszkanieGetDTO> saved = new ArrayList<>();
        for(var dto : dtos){
            saved.add(mieszkanieService.createMieszkanie(dto));
        }
        return ResponseEntity.ok(saved);
    }
}

