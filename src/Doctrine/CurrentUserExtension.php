<?php

namespace App\Doctrine;

use Doctrine\ORM\QueryBuilder;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Security;


class CurrentUserExtension  implements QueryCollectionExtensionInterface,QueryItemExtensionInterface
{
    /**

     * @var Security
     */
    private $security;


    /**
     * Undocumented variable
     *
     * @var AuthorizationCheckerInterface
     */
    private $auth;// administrateur

    public function __construct(Security $security,AuthorizationCheckerInterface $checker)
    {
        $this->security=$security;
        $this->auth = $checker;
    }

    private  function addWhere(string $resourceClass, QueryBuilder $queryBuilder)
    {
            // obtenir le user connecter
            $user = $this->security->getUser();

            // si on demande la liste des invoices alors agir sur la requete pour qu'il tienne compte du user connecter

            if ($user instanceof User &&  !$this->auth->isGranted('ROLE_ADMIN')) { // s'il est connecter user !=null et que le user n'est  pas l'administrateur donc il ne vera que ces info personnel
                if ($resourceClass === Customer::class || $resourceClass === Invoice::class) {

                    $rootAlias = $queryBuilder->getRootAliases()[0]; //ici "o"

                    if ($resourceClass === Customer::class) {
                        $queryBuilder->andWhere("$rootAlias.user = :user");
                    } else if ($resourceClass === Invoice::class) {
                        $queryBuilder->join("$rootAlias.customer", "c")
                            ->andWhere("c.user = :user");
                    }
                    $queryBuilder->setParameter("user", $user);

                    //dd($queryBuilder);
                }
            }
    }


    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        $this->addWhere($resourceClass, $queryBuilder);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, string $operationName = null, array $context = [])
    {
        $this->addWhere($resourceClass, $queryBuilder);
    }

 
}
