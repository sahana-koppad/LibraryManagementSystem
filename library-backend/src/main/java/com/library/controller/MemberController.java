package com.library.controller;

import com.library.model.Member;
import com.library.service.MemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping
    public List<Member> getAll() { return memberService.getAll(); }

    @GetMapping("/{id}")
    public Member getById(@PathVariable Long id) { return memberService.getById(id); }

    @PostMapping
    public ResponseEntity<Member> create(@RequestBody Member member) {
        return new ResponseEntity<>(memberService.create(member), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public Member update(@PathVariable Long id, @RequestBody Member member) {
        return memberService.update(id, member);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        memberService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
