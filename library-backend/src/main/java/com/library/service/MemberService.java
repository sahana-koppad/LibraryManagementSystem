package com.library.service;

import com.library.exception.ResourceNotFoundException;
import com.library.model.Member;
import com.library.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public List<Member> getAll() { return memberRepository.findAll(); }

    public Member getById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found: " + id));
    }

    public Member create(Member member) { return memberRepository.save(member); }

    public Member update(Long id, Member updated) {
        Member existing = getById(id);
        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        return memberRepository.save(existing);
    }

    public void delete(Long id) { memberRepository.delete(getById(id)); }
}
