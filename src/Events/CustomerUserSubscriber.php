<?php

namespace  App\Events;

use Symfony\Component\HttpKernel\KernelEvents;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\Security\Core\Security;

class CustomerUserSubscriber implements EventSubscriberInterface{

    /**
     * Undocumented variable
     *
     * @var Security
     */
    private $security;

    public function __construct(Security $security)
    {
      $this->security=$security;   
    }

    public static  function getSubscribedEvents()
    {
        return  [
            KernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE]
        ];
    }


    public function setUserForCustomer(ViewEvent $event) // $event : on juste au momemt en l'ecriture sur la base
    {
        $customer = $event->getControllerResult();
        $method = $event->getRequest()->getMethod(); // GET POST PUT .....

        if ($customer instanceof Customer && $method == "POST") {
           $user= $this->security->getUser();
           $customer->setUser($user);
           //dd($customer);
        }
    }

}


