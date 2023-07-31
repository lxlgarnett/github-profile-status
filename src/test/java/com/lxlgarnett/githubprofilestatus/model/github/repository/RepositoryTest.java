/*
 * Created by Xiaolei Li on 7/31/23, 8:21 PM
 * Copyright (c) 2023 Xiaolei Li.
 * All rights reserved.
 * Last modified 7/31/23, 8:21 PM
 */

package com.lxlgarnett.githubprofilestatus.model.github.repository;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

/**
 * Unit test for Repository class.
 *
 * @author xiaolei
 */
@QuarkusTest
class RepositoryTest {

    @Test
    void testGettersAndSetters() {
        Repository repository = new Repository();
        repository.setFork(false);
        repository.setDescription("Some description");
        repository.setId(123456789L);
        repository.setName("repository name");
        repository.setFullName("full name of repository");
        repository.setUrl("https://github.com/");
        repository.setHtmlUrl("https://github.com/");
        repository.setLanguagesUrl("https://github.com/languages/");

        Assertions.assertAll(
                () -> Assertions.assertEquals("Some description", repository.getDescription()),
                () -> Assertions.assertFalse(repository.isFork()),
                () -> Assertions.assertEquals(123456789L, repository.getId()),
                () -> Assertions.assertEquals("repository name", repository.getName()),
                () -> Assertions.assertEquals("full name of repository", repository.getFullName()),
                () -> Assertions.assertEquals("https://github.com/", repository.getUrl()),
                () -> Assertions.assertEquals("https://github.com/", repository.getHtmlUrl()),
                () -> Assertions.assertEquals("https://github.com/languages/", repository.getLanguagesUrl())
        );
    }

    @Test
    void testToString() {
        Repository repository = new Repository();
        repository.setFork(false);
        repository.setDescription("Some description");
        repository.setId(123456789L);
        repository.setName("repository name");
        repository.setFullName("full name of repository");
        repository.setUrl("https://github.com/");
        repository.setHtmlUrl("https://github.com/");
        repository.setLanguagesUrl("https://github.com/languages/");

        Assertions.assertEquals("Repository{id=123456789, name='repository name', fullName='full name of repository', htmlUrl='https://github.com/', description='Some description', languagesUrl='https://github.com/languages/', fork=false, url='https://github.com/'}", repository.toString());
    }

    @Test
    void testEqualsAndHashCode() {
        Repository repository1 = new Repository();
        repository1.setFork(false);
        repository1.setDescription("Some description");
        repository1.setId(123456789L);
        repository1.setName("repository name");
        repository1.setFullName("full name of repository");
        repository1.setUrl("https://github.com/");
        repository1.setHtmlUrl("https://github.com/");
        repository1.setLanguagesUrl("https://github.com/languages/");

        Repository repository2 = new Repository();
        repository2.setFork(false);
        repository2.setDescription("Some description");
        repository2.setId(123456789L);
        repository2.setName("repository name");
        repository2.setFullName("full name of repository");
        repository2.setUrl("https://github.com/");
        repository2.setHtmlUrl("https://github.com/");
        repository2.setLanguagesUrl("https://github.com/languages/");

        Assertions.assertTrue(repository1.equals(repository2));
        Assertions.assertEquals(repository1.hashCode(), repository2.hashCode());
    }
}